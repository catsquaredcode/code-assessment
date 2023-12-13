CREATE PROCEDURE [dbo].[usp_movecase] 
  @casetomove UNIQUEIDENTIFIER,
  @destinationpallet UNIQUEIDENTIFIER = NULL
WITH ENCRYPTION
AS
BEGIN
  SET NOCOUNT ON;
   
  DECLARE @Result AS INT = 0
  DECLARE @_errormessage NVARCHAR(MAX)  

  DECLARE @caseserial int
  DECLARE @palletserial int

  DECLARE @caseproduct UNIQUEIDENTIFIER
  DECLARE @casecurrentpallet UNIQUEIDENTIFIER
  DECLARE @caseproductcategory UNIQUEIDENTIFIER

  DECLARE @palletproductcategory UNIQUEIDENTIFIER

  BEGIN TRANSACTION 
    BEGIN TRY
      
      --IF DESTINATION PALLET WAS NOT SPECIFIED, A NEW ONE WILL BE CREATED
      IF @destinationpallet IS NULL
      BEGIN
       
       --GET NEW ID
       SELECT @destinationpallet = NEWID()

       --CREATE NEW PALLET
       INSERT INTO [dbo].[pallet]
           ([guid]
           ,[creationdate]
           ,[modifieddate])
       VALUES
           (@destinationpallet
           ,GETDATE()
           ,GETDATE())
       
       --GET NEW PALLET SERIAL
       SELECT @palletserial = @@IDENTITY

      END
      ELSE
      BEGIN
        
        --IF DESTINATION PALLET WAS SPECIFIED, GET PALLET'S SERIAL
        SELECT @palletserial=[serial]
        FROM [pallet]
        WHERE [pallet].[guid] = @destinationpallet

      END
      
      --IF PALLET WAS NOT FOUND, RAISE AN ERROR
      IF @palletserial IS NULL
        RAISERROR ('Destination pallet not found.', 16, -1);

      --GET CASE DETAILS
      SELECT @caseserial=[case].serial, @caseproduct=[case].[productguid], @casecurrentpallet=[case].[palletguid], @caseproductcategory=[productcategory].[guid]
      FROM [case] INNER JOIN
           [product] ON [case].[productguid] = [product].[guid] INNER JOIN
           [productcategory] ON [product].productcategoryguid = [productcategory].[guid]
      WHERE [case].[guid] = @casetomove

      --IF CASE TO MOVE WAS NOT FOUND, RAISE AN ERROR
      IF @caseserial IS NULL
        RAISERROR ('Case to move not found.', 16, -1);
      
      --IF CASE IS ALREADY IN THE DESTINATION PALLET, RAISE AN ERROR
      IF @casecurrentpallet = @destinationpallet
        RAISERROR ('Case is already in destination pallet.', 16, -1);

      --GET PALLET PRODUCT CATEGORY
      SELECT DISTINCT TOP 1 @palletproductcategory=[productcategory].[guid]
      FROM [case] INNER JOIN
           [product] ON [case].[productguid] = [product].[guid] INNER JOIN
           [productcategory] ON [product].productcategoryguid = [productcategory].[guid]
      WHERE [case].[palletguid]=@destinationpallet

      --IF CASE PRODUCT CATEGORY DOES NOT MATCH WITH PALLET PRODUCT CATEGORY, RAISE AN ERROR
      IF @caseproductcategory != @palletproductcategory
        RAISERROR ('Case product category does not match with pallet product category.', 16, -1);

      --UPDATE CASE PALLET
      UPDATE [case]
      SET [case].[palletguid] = @destinationpallet
      WHERE [case].[serial] =@caseserial

    END TRY
    BEGIN CATCH
      --IN CASE OF ERROR, SET RESULT TO -1 AND ERRORMESSAGE TO ERROR_MESSAGE()
      SET @Result = -1

      SELECT @_errormessage =  ERROR_MESSAGE()
            
    END CATCH

  IF (@@TRANCOUNT > 0)
  BEGIN
    --IF RESULT IS ZERO OR POSITIVE, COMMIT TRANSACTION
    IF (@Result >= 0)
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