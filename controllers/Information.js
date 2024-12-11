const bannerModel = require("../models/banner.model");
const serviceModel = require("../models/service.model");

const getBanner = async(req, res) => {
    try {
        const bannerData = [];

        const getBanner = await bannerModel.getBanner();

        if (Array.isArray(getBanner) && getBanner.length !== 0) {
            for (const banner of getBanner) {
                const bannerItem = {
                    banner_name: banner.banner_name,
                    banner_image: banner.banner_image,
                    description: banner.banner_description
                }
    
                bannerData.push(bannerItem);
            }
        }

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: bannerData
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message,
            data: error.stack
        });
    }
}

const getServices = async(req, res) => {
    try {
        const serviceData = [];

        const getService = await serviceModel.getService();

        if (Array.isArray(getService) && getService.length !== 0) {
            for (const service of getService) {
                const serviceItem = {
                    service_code: service.service_code,
                    service_name: service.service_name,
                    service_icon: service.service_icon,
                    service_tariff: service.service_tariff
                }

                serviceData.push(serviceItem);
            }
        }

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: serviceData
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message,
            data: error.stack
        });
    }
}

module.exports = { getBanner, getServices };