CREATE PROCEDURE usp_movecase
  @casetomove UNIQUEIDENTIFIER
WITH ENCRYPTION
AS
BEGIN
  SET NOCOUNT ON;
   
  DECLARE @Result AS INT = 0
  DECLARE @_errormessage NVARCHAR(MAX)  

  BEGIN TRANSACTION 
    BEGIN TRY
     
      PRINT 'Retrieve one ProductCategory of the case (the last case has 2 products of the same category)'
      declare @caseProductCategory UNIQUEIDENTIFIER
      declare @caseCurrentPallet UNIQUEIDENTIFIER
      select @caseProductCategory = PC.guid,  @caseCurrentPallet = C.palletguid
        FROM [case] C 
        JOIN product P ON C.productguid=P.guid 
        JOIN productcategory PC ON P.productcategoryguid=PC.guid 		
		WHERE C.guid=@casetomove

      PRINT @caseProductCategory
	  


	  
      PRINT 'Retrieve TargetPallet'
      declare @targetPallet UNIQUEIDENTIFIER

		SELECT *
		INTO #PalletProductsCategories
		FROM 
		(select PL.guid, P.productcategoryguid
			FROM pallet PL 
			JOIN [case] C ON C.palletguid=PL.guid
			JOIN product P ON C.productguid=P.guid 
			WHERE PL.guid <> @caseCurrentPallet
			GROUP BY PL.guid, P.productcategoryguid
		) as PalletProductsCategories



		SELECT @targetPallet = P.guid 
			FROM  #PalletProductsCategories P
			GROUP BY P.guid
			--only one category and equals to @caseProductCategory (in order to exclude pallets with other products categories)
			HAVING count(*) = 1 AND P.guid IN (SELECT [guid] FROM #PalletProductsCategories WHERE productcategoryguid = @caseProductCategory)

		DROP TABLE #PalletProductsCategories


      PRINT @targetPallet
	  IF (@targetPallet IS NULL)
	  BEGIN
		PRINT 'No target pallet found'
		SET @Result = -1  
	  END
	  ELSE
		  update [case] set palletguid=@targetPallet where guid=@casetomove
	  
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
      PRINT 'Commited Transaction at ' + CONVERT(varchar, GETDATE())
    END
    ELSE
    BEGIN      
      ROLLBACK TRANSACTION
      PRINT 'Rolled back Transaction at ' + CONVERT(varchar, GETDATE()) + 'because of error: ' + @_errormessage
    END
  END  
  
  RETURN @Result  
END