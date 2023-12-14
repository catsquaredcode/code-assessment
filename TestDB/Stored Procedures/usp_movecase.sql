CREATE PROCEDURE [dbo].[usp_movecase] 
  @casetomove UNIQUEIDENTIFIER,
  @targetpallet UNIQUEIDENTIFIER=NULL
WITH ENCRYPTION
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @Result AS INT=0
  DECLARE @_errormessage NVARCHAR(MAX)  
  DECLARE @serialcase int
  DECLARE @caseproduct UNIQUEIDENTIFIER
  DECLARE @casecurrentpallet UNIQUEIDENTIFIER
  DECLARE @caseproductcategory UNIQUEIDENTIFIER
  DECLARE @serialpallet int
  DECLARE @palletproductcategory UNIQUEIDENTIFIER
  BEGIN TRANSACTION 
    BEGIN TRY
      --CREATE PALLET IF NULL
      IF @targetpallet is null
      BEGIN
       --SET GUID FOR TARGET PALLET
       SELECT @targetpallet=NEWID()
       --CREATE NEW PALLET
       INSERT INTO [dbo].[pallet]
           ([guid]
           ,[creationdate]
           ,[modifieddate])
       VALUES
           (@targetpallet
           ,GETDATE()
           ,GETDATE())
       --RETRIEVE SERIAL PALLET 
       SELECT @serialpallet=@@IDENTITY
      END
      ELSE
      BEGIN
        --RETRIEVE SERIAL PALLET 
        SELECT @serialpallet=[serial]
        FROM [pallet]
        WHERE [pallet].[guid]=@targetpallet
      END
      --PALLET NOT FOUND
      IF @serialpallet IS NULL
        RAISERROR ('Pallet not found.', 16, 1);
      --GET CASE INFO
      SELECT @serialcase=[case].serial,
			 @caseproduct=[case].[productguid],
			 @casecurrentpallet=[case].[palletguid],
			 @caseproductcategory=[productcategory].[guid]
      FROM [case] INNER JOIN
           [product] ON [case].[productguid]=[product].[guid]
		   INNER JOIN
           [productcategory] ON [product].productcategoryguid=[productcategory].[guid]
      WHERE [case].[guid]=@casetomove
      --CASE PROVIDED NOT FOUND
      IF @serialcase IS NULL
        RAISERROR ('Case provided not found.', 16, 1);
      --IF CASE IS ALREADY IN THE DESTINATION PALLET, RAISE AN ERROR
      IF @casecurrentpallet=@targetpallet
        RAISERROR ('Case is already on target pallet.', 16, 1);
      --GET PALLET PRODUCT CATEGORY
      SELECT DISTINCT TOP 1 @palletproductcategory=[productcategory].[guid]
      FROM [case] INNER JOIN
           [product] ON [case].[productguid]=[product].[guid] INNER JOIN
           [productcategory] ON [product].productcategoryguid=[productcategory].[guid]
      WHERE [case].[palletguid]=@targetpallet
      --CHECK IF PRODUCT CATEGORY IS NOT EQUAL TO PALLET PRODUCT CATEGORY THAN RAISE AN ERROR
      IF @caseproductcategory!=@palletproductcategory
        RAISERROR ('Case product category is not equal to pallet product category.', 16, 1);
      --UPDATE CASE PALLET
      UPDATE [case]
      SET [case].[palletguid]=@targetpallet
      WHERE [case].[serial]=@serialcase
    END TRY
    BEGIN CATCH
      --IN CASE OF ERROR, SET RESULT TO -1 AND ERRORMESSAGE TO ERROR_MESSAGE()
      SET @Result=-1
      SELECT @_errormessage=ERROR_MESSAGE()
    END CATCH
  IF (@@TRANCOUNT>0)
  BEGIN
    --IF RESULT IS ZERO OR POSITIVE, COMMIT TRANSACTION
    IF (@Result>=0)
    BEGIN      
      COMMIT TRANSACTION            
      PRINT 'Commited Transaction at ' + CONVERT(varchar(10),GETDATE(),103)
    END
    --OTHERWISE, ROLLBACK TRANSACTION
    ELSE
    BEGIN      
      ROLLBACK TRANSACTION
      PRINT 'Rolled back Transaction at ' + CONVERT(varchar(10),GETDATE(),103) + ' because of error: ' + @_errormessage
    END
  END  
  RETURN @Result  
END
-- exec dbo.usp_movecase '08bbb8f6-65b7-46a4-9da3-b8852b1d1fcb' --TEST NEW PALLET
-- exec dbo.usp_movecase '08bbb8f6-65b7-46a4-9da3-b8852b1d1fcb', '36CB0684-9A64-4663-AF33-3F271EFB8D05' --TEST IF SAME PALLET
-- exec dbo.usp_movecase '08bbb8f6-65b7-46a4-9da3-b8852b1d1fcb', '9A03FC4B-37AF-4560-8923-7657E804DD82' --TEST NO SAME CATEGORY
-- exec dbo.usp_movecase '08bbb8f6-65b7-46a4-9da3-b8852b1d1fcb', '844B12EA-F822-4223-9011-6F4D8B6367A1' --TEST SAME CATEGORY
