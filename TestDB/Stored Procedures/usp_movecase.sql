alter PROCEDURE [dbo].[usp_movecase] 
  @casetomove UNIQUEIDENTIFIER
WITH ENCRYPTION
AS
BEGIN
  SET NOCOUNT ON;
   
  DECLARE @Result AS INT = 0
  DECLARE @_errormessage NVARCHAR(MAX)  

  BEGIN TRANSACTION 
    BEGIN TRY
     
      --PRINT 'your code goes here'
      with all_data as (
        select c.serial     as case_serial,
                c.guid      as case_guid,
                --
                p.serial    as product_serial,
                p.guid      as product_guid,
                p.name      as product_name,
                --
                pc.guid     as productcategory_guid,
                pc.serial   as productcategory_serial,
                pc.name     as productcategoty_name,
                --
                pl.guid     as pallet_guid,
                pl.serial   as pallet_serial
        from dbo.[case]                 as c 
        left join dbo.product           as p on p.guid = c.productguid
        left join dbo.productcategory   as pc on pc.guid = p.productcategoryguid
        left join dbo.pallet            as pl on pl.guid = c.palletguid
    ),
    to_move as (
        select *
        from all_data as tomove
        where tomove.case_guid = @casetomove
    ),
    new_pallet as (
        select top 1 dest.*
        from  dbo.pallet as dest
        inner join to_move on to_move.pallet_guid != dest.guid
        --where dest.productcategory_guid = to_move.productcategory_guid
        where exists (select 1 from all_data as x where x.pallet_guid = dest.guid and x.productcategory_guid = to_move.productcategory_guid)
    )
    update dbo.[case] set palletguid = x.guid
    from new_pallet as x
    where dbo.[case].[guid] = @casetomove

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
      --PRINT 'Commited Transaction at ' + GETDATE()
      PRINT 'Commited Transaction at ' + convert(varchar, GETDATE(), 121)
    END
    ELSE
    BEGIN      
      ROLLBACK TRANSACTION
      --PRINT 'Rolled back Transaction at ' + GETDATE() + 'because of error: ' + @_errormessage
      PRINT 'Rolled back Transaction at ' + convert(varchar, GETDATE(), 121) + 'because of error: ' + @_errormessage
    END
  END  
  
  RETURN @Result  
END