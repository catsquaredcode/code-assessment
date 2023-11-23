CREATE TABLE [dbo].[productcategory] (
    [serial]       INT IDENTITY (1, 1) NOT NULL,
    [guid]         UNIQUEIDENTIFIER DEFAULT(NEWID()) NOT NULL,
    [creationdate] DATETIME DEFAULT(GETDATE()) NOT NULL,
    [modifieddate] DATETIME DEFAULT(GETDATE()) NOT NULL,       
    [name]         NVARCHAR(50) NOT NULL
    CONSTRAINT [PK_productcategory] PRIMARY KEY CLUSTERED ([serial] ASC)
);

GO

ALTER TABLE [dbo].[productcategory]   
ADD CONSTRAINT PC_guid UNIQUE ([guid]);   

GO
CREATE TRIGGER [dbo].[trg_productcategory_modifieddate]
    ON [dbo].[productcategory]
    AFTER UPDATE
    AS
    BEGIN
       SET NOCOUNT ON;

	  IF EXISTS (SELECT 0 FROM inserted)
	  BEGIN
		  UPDATE T1
		  SET [modifieddate] = GETDATE()
		  FROM [dbo].[productcategory] T1
			    INNER JOIN
			   inserted T2 ON T1.[serial] = T2.[serial]
	  END
END


