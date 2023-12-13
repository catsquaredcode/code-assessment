CREATE TABLE [dbo].[pallet] (
    [serial]       INT IDENTITY (1, 1) NOT NULL,
    [guid]         UNIQUEIDENTIFIER DEFAULT(NEWID()) NOT NULL,
    [creationdate] DATETIME DEFAULT(GETDATE()) NOT NULL,
    [modifieddate] DATETIME DEFAULT(GETDATE()) NOT NULL,       
    CONSTRAINT [PK_pallet] PRIMARY KEY CLUSTERED ([serial] ASC)
);
GO

CREATE TRIGGER [dbo].[trg_pallet_modifieddate]
    ON [dbo].[pallet]
    AFTER UPDATE
    AS
    BEGIN
       SET NOCOUNT ON;

	  IF EXISTS (SELECT 0 FROM inserted)
	  BEGIN
		  UPDATE T1
		  SET [modifieddate] = GETDATE()
		  FROM [dbo].[pallet] T1
			    INNER JOIN
			   inserted T2 ON T1.[serial] = T2.[serial]
	  END
END
GO

CREATE NONCLUSTERED INDEX [IX_pallet_guid] ON [dbo].[pallet]
(
	[guid] ASC
)
INCLUDE([serial]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

