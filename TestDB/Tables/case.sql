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

ALTER TABLE [dbo].[case]
   ADD CONSTRAINT FK_case_pallet FOREIGN KEY ([palletguid])
      REFERENCES [dbo].[pallet] ([guid])
      ON DELETE CASCADE
      ON UPDATE CASCADE
;

GO

ALTER TABLE [dbo].[case]
   ADD CONSTRAINT FK_case_product FOREIGN KEY ([productguid])
      REFERENCES [dbo].[product] ([guid])
      ON DELETE CASCADE
      ON UPDATE CASCADE
;

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


