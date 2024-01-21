CREATE TABLE [dbo].[case] (
    [serial]       INT              IDENTITY (1, 1) NOT NULL,
    [guid]         UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [creationdate] DATETIME         DEFAULT (getdate()) NOT NULL,
    [modifieddate] DATETIME         DEFAULT (getdate()) NOT NULL,
    [palletguid]   UNIQUEIDENTIFIER NOT NULL,
    [productguid]  UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_case] PRIMARY KEY CLUSTERED ([serial] ASC)
);



GO
CREATE TRIGGER [dbo].[trg_case_modifieddate]
    ON [dbo].[case]
    AFTER UPDATE
    AS
    BEGIN
       SET NOCOUNT ON;

	  IF EXISTS (SELECT 0 FROM inserted)
	  BEGIN
		  UPDATE T1
		  SET [modifieddate] = GETDATE()
		  FROM [dbo].[case] T1
			    INNER JOIN
			   inserted T2 ON T1.[serial] = T2.[serial]
	  END
END
GO

create nonclustered index [IX_case_guid] on [dbo].[case] ([guid]) include (productguid)
GO


create nonclustered index [IX_case_productguid] ON [dbo].[case] (productguid)
GO

create nonclustered index [IX_case_guid_palletguid] ON [dbo].[case]([guid], palletguid) include (productguid);
GO
