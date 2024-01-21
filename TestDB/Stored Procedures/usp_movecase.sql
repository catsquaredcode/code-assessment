CREATE PROCEDURE [dbo].[usp_movecase] 
  @casetomove UNIQUEIDENTIFIER,
  @destinationpallet UNIQUEIDENTIFIER = NULL /* Option, if is null the destination is new */
WITH ENCRYPTION
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @Result AS INT = 0
  DECLARE @_errormessage NVARCHAR(MAX)  
  /**/
  declare @tblPalet table (NewGuid uniqueidentifier)

  BEGIN TRANSACTION 
    BEGIN TRY
      
      /* validation */
      if (@casetomove IS NULL) begin
        raiserror ('Case error', 16, -1);
      end

      if (not exists (select null from [case] where [guid] = @casetomove)) begin
        raiserror ('Case not found', 16, -1);
      end

      if (@destinationpallet is not null) begin
        if (not exists (select null from pallet where [guid] = @destinationpallet)) begin
          raiserror ('Pallet not found', 16, -1);
        end

        /* check case category same on pallet */
        if (exists (select null
                    from [case]
                    inner join product on [case].productguid = product.guid 
                      where [case].palletguid = @destinationpallet
                         or [case].[guid] = @casetomove
                    group by productcategoryguid 
                    having count(*) > 1)) begin
          raiserror ('Pallet not compatible', 16, -1);
        end

        /* check source and destination pallet need different */
        if (exists (select null from [case] where [guid] = @casetomove and palletguid = @destinationpallet)) begin
          raiserror ('Pallet source and destination are same', 16, -1);
        end

      end
  
      if (@destinationpallet is null) begin
        /* create new pallet */
        insert into pallet ([guid]) 
        output inserted.[guid] into @tblPalet (NewGuid)
        values (default)

        select @destinationpallet = NewGuid from @tblPalet
      end 

      /* update data */
      UPDATE [case]
      SET palletguid = @destinationpallet
      WHERE [guid] = @casetomove

    END TRY
    BEGIN CATCH
      SET @Result = -1    

      SELECT @_errormessage =  ERROR_MESSAGE()
            
    END CATCH

  IF (@@TRANCOUNT > 0)
  BEGIN
    IF (@Result >= 0)
    BEGIN      
      COMMIT TRANSACTION            
      PRINT concat('Commited Transaction at ', GETDATE())
    END
    ELSE
    BEGIN      
      ROLLBACK TRANSACTION
      PRINT concat('Rolled back Transaction at ', GETDATE(), ' because of error: ', @_errormessage)
    END
  END  
  
  RETURN @Result  
END