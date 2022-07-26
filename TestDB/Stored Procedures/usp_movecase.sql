--exec dbo.usp_movecase '08bbb8f6-65b7-46a4-9da3-b8852b1d1fcb'

CREATE PROCEDURE [dbo].[usp_movecase] 
  @casetomove UNIQUEIDENTIFIER
WITH ENCRYPTION
AS
BEGIN
  SET NOCOUNT ON;
   
  DECLARE @Result AS INT = 0
  DECLARE @_errormessage NVARCHAR(MAX);

  DECLARE @guidPallet UNIQUEIDENTIFIER,
	@guidCategoria UNIQUEIDENTIFIER, @guidProducto UNIQUEIDENTIFIER, 
	@newpallet UNIQUEIDENTIFIER;
	
	select
	@guidPallet = pal.guid,
	@guidCategoria = prc.guid,
	@guidProducto = prd.guid
		FROM dbo.[case] as cas
			left outer join dbo.product as prd
				on prd.guid = cas.productguid
			left outer join dbo.pallet as pal
				on pal.guid = cas.palletguid
			left outer join dbo.productcategory as prc
				on prc.guid = prd.productcategoryguid
	WHERE cas.guid = @casetomove;

	Select top 1
		@newpallet = pal.guid	
	from dbo.[case] cas
		left outer join dbo.product as prd
			on prd.guid = cas.productguid
		left outer join dbo.pallet as pal
			on pal.guid = cas.palletguid
		left outer join dbo.productcategory as prc
			on prc.guid = prd.productcategoryguid
	where pal.guid !=  @guidPallet
		and prc.guid = @guidCategoria

  BEGIN TRANSACTION 
    BEGIN TRY
     
		update dbo.[case]
		set palletguid = @newpallet
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
      PRINT 'Commited Transaction at ' + CONVERT(nvarchar(10), getdate(), 103)
    END
    ELSE
    BEGIN      
      ROLLBACK TRANSACTION
      PRINT 'Rolled back Transaction at ' + CONVERT(nvarchar(10), getdate(), 103) + 'because of error: ' + @_errormessage
    END
  END  
  
  RETURN @Result  
END
GO
