CREATE PROCEDURE [dbo].[usp_movecase] 
  @casetomove UNIQUEIDENTIFIER
WITH ENCRYPTION
AS
BEGIN
  SET NOCOUNT ON;
   
  DECLARE @Result AS INT = 0
  DECLARE @_errormessage NVARCHAR(MAX)  

  BEGIN TRANSACTION 
    BEGIN TRY
     
        DECLARE @palletGuid UNIQUEIDENTIFIER;
        DECLARE @categoryGuid UNIQUEIDENTIFIER;
        DECLARE @targetPalletGuid UNIQUEIDENTIFIER;

        SELECT 
	        @palletGuid=c.palletguid, 
	        @categoryGuid=pc.guid 
        FROM [case] c 
	        inner join product p on c.productguid=p.guid 
	        inner join productcategory pc on pc.guid=p.productcategoryguid 
        WHERE c.guid= @casetomove;

        SELECT TOP 1 
	        @targetPalletGuid=p.guid 
        FROM pallet p 
	        inner join [case] c on c.palletguid=p.guid
	        inner join product pr on c.productguid=pr.guid
	        inner join productcategory pc on pc.guid=pr.productcategoryguid
        WHERE pc.guid = @categoryGuid
	        and p.guid != @palletGuid;

        IF (@targetPalletGuid is not NULL)
        BEGIN
	        update [case]
	        set palletguid = @targetPalletGuid
	        where [case].guid = @casetomove		
        END
        ELSE
	        RAISERROR('No Pallets available',16,1);


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
      PRINT 'Commited Transaction at ' + CONVERT(nvarchar(19), getdate(), 126)
    END
    ELSE
    BEGIN      
      ROLLBACK TRANSACTION
     PRINT 'Rolled back Transaction at ' + CONVERT(nvarchar(19), getdate(), 126) + ' because of error: ' + @_errormessage
    END
  END  
  
  RETURN @Result  
END