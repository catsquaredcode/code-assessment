CREATE PROCEDURE [dbo].[usp_movecase] 
  @casetomove UNIQUEIDENTIFIER
WITH ENCRYPTION
AS
BEGIN
  SET NOCOUNT ON;
   
  DECLARE @Result AS INT = 0
  DECLARE @_errormessage NVARCHAR(MAX)  
  Declare @Pcategory uniqueidentifier
  Declare @Ppallet uniqueidentifier
  Declare @Newpallet uniqueidentifier
  BEGIN TRANSACTION 
    BEGIN TRY
     
	  Select @Ppallet = C.Palletguid,  
	         @Pcategory = Prd.Productcategoryguid
	  From [Case] C 
	  Inner Join Product Prd on ( Prd.guid = C.Productguid)
	  where c.guid = @casetomove

	  if (@Ppallet is null Or @Pcategory is null) Throw 50000,'Case not found',1

	  Select Top 1 @Newpallet = P.guid
	  From Pallet P
	  Inner join [Case] C on (P.guid = C.Palletguid)
	  Inner Join Product Prd on ( Prd.guid = C.Productguid)
	  Where P.guid <> @Ppallet
	    And Prd.productCategoryguid = @PCategory

		print 'Check found pallet'
	if ( @Newpallet is null)
		Begin
			print 'Search empty pallet'

			Select Top 1 @NewPallet =  P.guid
			From Pallet P
			Where Not Exists ( Select 1 From [Case] C Where C.Palletguid = p.guid)

		End

	if ( @Newpallet is null) Throw 50000,'No pallet avaiable',1

	Update [Case]
	  set PalletGuid = @NewPallet,
	  modifieddate = GetDate()
	Where guid = @casetomove


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
      PRINT 'Commited Transaction at ' + Convert(Varchar(20), GETDATE(),120)
    END
    ELSE
    BEGIN      
      ROLLBACK TRANSACTION
      PRINT 'Rolled back Transaction at ' +  Convert(Varchar(20), GETDATE(),120) + 'because of error: ' + @_errormessage
    END
  END  
  
  RETURN @Result  
END