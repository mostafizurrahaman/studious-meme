// import { AdminService } from './admin.service';
// import httpStatus from 'http-status';
// import { asyncHandler, sendResponse } from '../../utils';

// // 1. adminGetAllDashboardMetaData
// // const adminGetAllDashboardMetaData = asyncHandler(async (_req, res) => {
// //   const result = await AdminService.adminGetAllDashboardMetaDataFromDB();

// //   sendResponse(res, {
// //     statusCode: httpStatus.OK,
// //     message: 'Dashboard data retrieved successfully!',
// //     data: result,
// //   });
// // });

// // 2. updateNewsStatus
// // const updateNewsStatus = asyncHandler(async (req, res) => {
// //   const result = await AdminService.updateNewsStatusFromDB(req.body, req.user);

// //   sendResponse(res, {
// //     statusCode: httpStatus.OK,
// //     message: 'News updated successfully!',
// //     data: result,
// //   });
// // });

// // 3. getAllAdmins
// const getAllAdmins = asyncHandler(async (req, res) => {
//     const result = await AdminService.getAllAdminsFromDB(req.query);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Admins retrieved successfully!',
//         data: result.data,
//         meta: result.meta,
//     });
// });

// // 3.1 adminCreateAccount
// const adminCreateAccount = asyncHandler(async (req, res) => {
//     const result = await AdminService.adminCreateAccountIntoDB(req.user, req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         message: 'Account created successfully!',
//         data: result,
//     });
// });

// // 3.2 adminUpdateAccount
// const adminUpdateAccount = asyncHandler(async (req, res) => {
//     const { userId } = req.params;

//     const result = await AdminService.adminUpdateAccountIntoDB(req.user, userId as string, req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Account updated successfully!',
//         data: result,
//     });
// });

// // 4. changeSpecificUserIsActiveStatus
// const changeSpecificUserIsActiveStatus = asyncHandler(async (req, res) => {
//     const { userId } = req.params;

//     const result = await AdminService.changeSpecificUserIsActiveStatusIntoDB(userId as string);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Account deactivated successfully!',
//         data: result,
//     });
// });

// // 5. getUniqueProductCategories
// const getUniqueProductCategories = asyncHandler(async (_req, res) => {
//     const result = await AdminService.getUniqueProductCategoriesFromDB();

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Categories retrieved successfully!',
//         data: result,
//     });
// });

// // 6. getUniqueProductNames
// const getUniqueProductNames = asyncHandler(async (_req, res) => {
//     const result = await AdminService.getUniqueProductNamesFromDB();

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Names retrieved successfully!',
//         data: result,
//     });
// });

// // 7. getUniqueProductCategoriesAndNames
// const getUniqueProductCategoriesAndNames = asyncHandler(async (_req, res) => {
//     const result = await AdminService.getUniqueProductCategoriesAndNamesFromDB();

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Categories and names retrieved successfully!',
//         data: result,
//     });
// });

// // 8. getProductsAvailableInAtLeastTwoShops
// const getProductsAvailableInAtLeastTwoShops = asyncHandler(async (_req, res) => {
//     const result = await AdminService.getProductsAvailableInAtLeastTwoShopsFromDB();

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Products retrieved successfully!',
//         data: result,
//     });
// });

// // 9. updateProductCategoryImage
// const updateProductCategoryImage = asyncHandler(async (req, res) => {
//     const file = req.file;

//     const result = await AdminService.updateProductCategoryImageFromDB(req.body?.category, file);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Category image updated successfully!',
//         data: result,
//     });
// });

// // 10. getAllShops
// const getAllShops = asyncHandler(async (_req, res) => {
//     const result = await AdminService.getAllShopsFromDB();

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Shops retrieved successfully!',
//         data: result,
//     });
// });

// // 11. updateShopLocation
// const updateShopLocation = asyncHandler(async (req, res) => {
//     const { shopId } = req.params;
//     const { address, latitude, longitude } = req.body as {
//         address?: string;
//         latitude?: number;
//         longitude?: number;
//     };

//     const result = await AdminService.updateShopLocationIntoDB(shopId as string, {
//         latitude,
//         longitude,
//         address,
//     });

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Shop location updated successfully!',
//         data: result,
//     });
// });

// export const AdminController = {
//     // adminGetAllDashboardMetaData,
//     // updateNewsStatus,
//     adminCreateAccount,
//     adminUpdateAccount,
//     getAllAdmins,
//     changeSpecificUserIsActiveStatus,
//     getUniqueProductCategories,
//     getUniqueProductNames,
//     getUniqueProductCategoriesAndNames,
//     getProductsAvailableInAtLeastTwoShops,
//     updateProductCategoryImage,
//     getAllShops,
//     updateShopLocation,
// };
