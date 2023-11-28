CREATE PROCEDURE [dbo].[usp_movecase] 
  @casetomove UNIQUEIDENTIFIER,
  @NewPallet UNIQUEIDENTIFIER,
  @ExitCode INT OUTPUT -- 0 case moved, 99 case product different, 98 case already on pallet  

WITH ENCRYPTION
AS
BEGIN
  SET NOCOUNT ON;
   
  DECLARE @Result AS INT = 0
  DECLARE @_errormessage NVARCHAR(MAX)  
  DECLARE @Rowcount as int = 0
  DECLARE @PalletID uniqueidentifier
  DECLARE @addcase as int = 0

  BEGIN TRANSACTION 
    BEGIN TRY

        SET @ExitCode = 0

        SELECT @PalletID = palletguid FROM [case] WHERE guid = @casetomove

            -- test if case is on the same pallet
        if @PalletID <> @NewPallet
        BEGIN
                -- test if pallet is empty and productID are identical
            SELECT @Rowcount = COUNT(DISTINCT productguid) FROM [case] WHERE palletguid = @NewPallet

                -- if pallet empty
            IF @Rowcount = 0
                SET @addcase = 1
            ELSE                 
                IF @Rowcount = 1 -- if only product ID 
                    SET @addcase = 1    
        
            IF @addcase = 1
                    -- move case into new pallet
                UPDATE [case] SET palletguid = @NewPallet WHERE guid = @casetomove
            ELSE 
                SET @ExitCode = 99   -- Case product id not compatible with other cases on pallet
        
        END 
        ELSE 
            SET @ExitCode = 98 -- Case is already on pallet 

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
      PRINT 'Commited Transaction at ' + GETDATE()
    END
    ELSE
    BEGIN      
      ROLLBACK TRANSACTION
      PRINT 'Rolled back Transaction at ' + GETDATE() + 'because of error: ' + @_errormessage
    END
  END  
  
  RETURN @Result  
END
