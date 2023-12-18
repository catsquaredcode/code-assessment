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
     
      PRINT 'your code goes here'

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