CREATE PROCEDURE [dbo].[usp_movecase] @casetomove UNIQUEIDENTIFIER
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Result AS INT = 0
	DECLARE @_errormessage NVARCHAR(MAX)

	BEGIN TRANSACTION

	BEGIN TRY
		DECLARE @caseproductgui UNIQUEIDENTIFIER = NULL;
		DECLARE @casepalletguid UNIQUEIDENTIFIER = NULL;
		DECLARE @casenewpalletguid UNIQUEIDENTIFIER = NULL;
		DECLARE @newcasetomove UNIQUEIDENTIFIER = NULL;

		-- check if case id is in the DB
		IF EXISTS (
				SELECT *
				FROM [case]
				WHERE [guid] = @casetomove
				)
		BEGIN
			-- case exists in [case] db, proceed mooving the case & 	 
			-- get case product id 
			-- get pallet id
			-- for this record
			SELECT @casepalletguid = palletguid
				,@caseproductgui = productguid
			FROM [case]
			WHERE [guid] = @casetomove;

			-- check if there is a pallet in the DB that stacks cases with
			-- same product ID as @casetomove, not the same of @casetomove pallet id
			IF EXISTS (
					SELECT *
					FROM [case]
					WHERE productguid = @caseproductgui
						AND [guid] <> @casetomove
						AND palletguid <> @casepalletguid
					)
			BEGIN
				-- yes there is, get the new pallet id @casetomove has to move to
				SELECT @casenewpalletguid = palletguid
				FROM [case]
				WHERE productguid = @caseproductgui
					AND [guid] <> @casetomove
					AND palletguid <> @casepalletguid

				-- update new pallet id for @casetomove 
				UPDATE [case]
				SET palletguid = @casenewpalletguid
				WHERE [guid] = @casetomove

				-- if the new pallet contains case with prod id different from @casetomove, try to move
				-- these cases to a different pallet containing same prod ids
				IF EXISTS (
						SELECT *
						FROM [case]
						WHERE palletguid = @casenewpalletguid
							AND productguid <> @caseproductgui
						)
				BEGIN
					-- yes, there is, get this new case id
					SELECT TOP 1 @newcasetomove = [guid]
					FROM [case]
					WHERE palletguid = @casenewpalletguid
						AND productguid <> @caseproductgui

					-- just simply recall this procedure with new case id to move as parameter
					EXEC [dbo].[usp_movecase] @newcasetomove
				
				END
			END
			ELSE
				PRINT 'No pallet with the same product ID of ' + cast(@casetomove AS VARCHAR(64)) + ' available'
		END
		ELSE
			PRINT 'case id provided [' + cast(@casetomove AS VARCHAR(64)) + '] does not exists'
	END TRY

	BEGIN CATCH
		SET @Result = - 1

		SELECT @_errormessage = ERROR_MESSAGE()
	END CATCH

	IF (@@TRANCOUNT > 0)
	BEGIN
		IF (@Result >= 0)
		BEGIN
			COMMIT TRANSACTION

			PRINT 'Commited Transaction at ' + cast(GETDATE() AS VARCHAR(30))
		END
		ELSE
		BEGIN
			ROLLBACK TRANSACTION

			PRINT 'Rolled back Transaction at ' + cast(GETDATE() AS VARCHAR(30)) + 'because of error: ' + @_errormessage
		END
	END

	RETURN @Result
END
