CREATE TABLE [dbo].[case] (
    [serial]       INT IDENTITY (1, 1) NOT NULL,
    [guid]         UNIQUEIDENTIFIER DEFAULT(NEWID()) NOT NULL,
    [creationdate] DATETIME DEFAULT(GETDATE()) NOT NULL,
    [modifieddate] DATETIME DEFAULT(GETDATE()) NOT NULL,       
    [palletguid]   UNIQUEIDENTIFIER NOT NULL
    CONSTRAINT [PK_case] PRIMARY KEY CLUSTERED ([serial] ASC), 
    [productguid] UNIQUEIDENTIFIER NOT NULL
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

CREATE NONCLUSTERED INDEX [IX_case_guid] ON [dbo].[case]
(
	[guid] ASC
)
INCLUDE([serial],[palletguid],[productguid]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

