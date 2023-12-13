CREATE VIEW [dbo].[CasesView]
	AS 
SELECT [case].serial As CaseSerial,
	   [case].[guid] As CaseGuid,
	   [pallet].serial As PalletSerial,
	   [pallet].[guid] As PalletGuid,
	   [product].[name] As ProductName,
	   [productcategory].[name] As ProductCategoryName 
FROM [dbo].[case] INNER JOIN
	 [dbo].[pallet] ON [case].palletguid = [pallet].[guid] INNER JOIN
	 [dbo].[product] ON [case].[productguid] = [product].[guid] INNER JOIN
	 [dbo].[productcategory] ON [product].[productcategoryguid] = [productcategory].[guid]