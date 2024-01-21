CREATE TABLE [dbo].[product] (
    [serial]              INT IDENTITY (1, 1) NOT NULL,
    [guid]                UNIQUEIDENTIFIER DEFAULT(NEWID()) NOT NULL,
    [creationdate]        DATETIME DEFAULT(GETDATE()) NOT NULL,
    [modifieddate]        DATETIME DEFAULT(GETDATE()) NOT NULL,      
    [name]                NVARCHAR(50) NOT NULL,
    [productcategoryguid] UNIQUEIDENTIFIER NOT NULL
    CONSTRAINT [PK_product] PRIMARY KEY CLUSTERED ([serial] ASC)
);

GO
CREATE TRIGGER [dbo].[trg_product_modifieddate]
    ON [dbo].[product]
    AFTER UPDATE
    AS
    BEGIN
       SET NOCOUNT ON;

	  IF EXISTS (SELECT 0 FROM inserted)
	  BEGIN
		  UPDATE T1
		  SET [modifieddate] = GETDATE()
		  FROM [dbo].[product] T1
			    INNER JOIN
			   inserted T2 ON T1.[serial] = T2.[serial]
	  END
END



GO

create nonclustered index [IX_product_guid] ON [dbo].[product] ([guid]) include (productcategoryguid)
