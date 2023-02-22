CREATE PROCEDURE [dbo].[usp_movecase] 
  @casetomove UNIQUEIDENTIFIER
WITH ENCRYPTION
AS
BEGIN
  SET NOCOUNT ON;
  
  DECLARE @Result AS INT = 0,
		  @_errormessage NVARCHAR(MAX)  ,
		  @productCategory UNIQUEIDENTIFIER,
		  @currentPallet UNIQUEIDENTIFIER,
		  @pallettomoveto UNIQUEIDENTIFIER

  BEGIN TRANSACTION 
    BEGIN TRY

		SELECT @productCategory = PC.guid, @currentPallet = C.palletguid
		FROM [case] AS C
		INNER JOIN product as P 
		ON C.productguid = P.guid
		INNER JOIN productcategory as PC
		ON P.productcategoryguid = PC.guid
		WHERE C.guid = @casetomove

		SELECT TOP 1 @pallettomoveto = P.guid
		FROM pallet as P
		WHERE P.guid NOT IN (
		  SELECT P.guid AS Pallet
		  FROM pallet AS P
		  INNER JOIN [case] as C
		  ON P.guid = C.palletguid
		  INNER JOIN product aS PR
		  ON PR.guid = C.productguid
		  INNER JOIN productcategory AS PC
		  ON PR.productcategoryguid = PC.guid
		  WHERE PC.guid != @productCategory
		  OR P.guid = @currentPallet
		  GROUP BY P.GUID
		)

		IF @pallettomoveto IS NOT NULL
		BEGIN
		  UPDATE [case] 
		  SET palletguid = @pallettomoveto
		  WHERE guid = @casetomove
		END

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
      PRINT 'Commited Transaction at ' + CONVERT(VARCHAR(200),GETDATE(), 0)
    END
    ELSE
    BEGIN      
      ROLLBACK TRANSACTION
      PRINT 'Rolled back Transaction at ' + CONVERT(VARCHAR(200),GETDATE(), 0) + 'because of error: ' + @_errormessage
    END
  END  

  RETURN @Result  
END
