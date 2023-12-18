TRUNCATE TABLE [dbo].[case]
TRUNCATE TABLE [dbo].[pallet]
TRUNCATE TABLE [dbo].[product]
TRUNCATE TABLE [dbo].[productcategory]

INSERT INTO [dbo].[case] ([guid], [palletguid], [productguid])
VALUES('1de2e437-f16a-4c1a-84b4-3cfc63310eca', '9a03fc4b-37af-4560-8923-7657e804dd82', '482d7d9e-f9ba-444f-86f2-084692336f42'),
      ('e1226b73-40a5-4f69-b23e-3976606d0ae2', '9a03fc4b-37af-4560-8923-7657e804dd82', '482d7d9e-f9ba-444f-86f2-084692336f42'),
      ('fa0f38be-657f-4a43-b9cd-6711807adb09', '9a03fc4b-37af-4560-8923-7657e804dd82', '482d7d9e-f9ba-444f-86f2-084692336f42'),

      ('970f9d4c-2fcb-48af-a547-8d3ba52637bc', '57104110-d03e-4da8-a914-b7ccb1ac604d', '482d7d9e-f9ba-444f-86f2-084692336f42'),

      ('4da8f24a-374e-4e78-a1b7-d15695697b7c', 'ed9d0fb4-8f7b-43e1-b968-c48f2b29b1da', 'cf1b257a-99b0-4abe-9428-983295073b14'),
      ('08bbb8f6-65b7-46a4-9da3-b8852b1d1fcb', 'ed9d0fb4-8f7b-43e1-b968-c48f2b29b1da', 'cf1b257a-99b0-4abe-9428-983295073b14'),
      
      ('35bf4e4a-94b9-46b0-b9ea-ed92bff095a3', '844b12ea-f822-4223-9011-6f4d8b6367a1', 'c8b50ee6-f09d-451f-b7e2-53193c8f6839'),
      
      ('9873fba8-276e-4b13-92f3-1ea2255b1c16', '8cd9d41a-33a7-4df3-9eb2-6d1d7aca20d1', 'c8b50ee6-f09d-451f-b7e2-53193c8f6839'),
      ('9873fba8-276e-4b13-92f3-1ea2255b1c16', '8cd9d41a-33a7-4df3-9eb2-6d1d7aca20d1', 'cf1b257a-99b0-4abe-9428-983295073b14')
      

INSERT INTO [dbo].[pallet] ([guid])
VALUES('9a03fc4b-37af-4560-8923-7657e804dd82'), 
      ('57104110-d03e-4da8-a914-b7ccb1ac604d'),
      ('ed9d0fb4-8f7b-43e1-b968-c48f2b29b1da'),
      ('844b12ea-f822-4223-9011-6f4d8b6367a1'),
      ('8cd9d41a-33a7-4df3-9eb2-6d1d7aca20d1')

INSERT INTO [dbo].[product] ([guid], [name], [productcategoryguid])
VALUES('482d7d9e-f9ba-444f-86f2-084692336f42', 'Product 1', '202f6fb0-d5dd-4379-ba2f-45c607f95151'),
      ('c8b50ee6-f09d-451f-b7e2-53193c8f6839', 'Product 2', 'f26b138f-12c5-48cc-80b8-803a72a589dd'),
      ('cf1b257a-99b0-4abe-9428-983295073b14', 'Product 3', 'f26b138f-12c5-48cc-80b8-803a72a589dd')

INSERT INTO [dbo].[productcategory] ([guid], [name])
VALUES('202f6fb0-d5dd-4379-ba2f-45c607f95151', 'Category 1'),
      ('f26b138f-12c5-48cc-80b8-803a72a589dd', 'Category 2')
