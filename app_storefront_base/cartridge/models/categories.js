'use strict';

var helper = require('~/cartridge/scripts/dwHelpers');
var URLUtils = require('dw/web/URLUtils');

/**
 * Get category url
 * @param {dw.catalog.Category} category - Current category
 * @returns {string} - Url of the category
 */
function getCategoryUrl(category) {
    return category.custom && category.custom.alternativeUrl
        ? category.custom.alternativeUrl
        : URLUtils.http('Search-Show', 'cgid', category.getID()).toString();
}

/**
 * Converts a given category from dw.catalog.Category to plain object
 * @param {dw.catalog.Category} category - A single category
 * @returns {Object} plain object that represents a category
 */
function categoryToObject(category) {
    if (!category.custom || !category.custom.showInMenu) {
        return null;
    }
    var result = {
        name: category.getDisplayName(),
        url: getCategoryUrl(category)
    };
    var subCategories = category.getOnlineSubCategories();

    if (subCategories.length > 0) {
        helper.forEach(subCategories, function (subcategory) {
            var converted = categoryToObject(subcategory);
            if (converted) {
                if (!result.subCategories) {
                    result.subCategories = [];
                }
                result.subCategories.push(converted);
            }
        });
        if (result.subCategories) {
            result.complexSubCategories = result.subCategories.some(function (item) {
                return !!item.subCategories;
            });
        }
    }

    return result;
}


/**
 * Represents a single category with all of it's children
 * @param {Collection<dw.catalog.Category>} categories - Top level categories
 * @constructor
 */
function categories(items) {
    this.categories = [];
    items.forEach(function (item) {
        if (item.custom && item.custom.showInMenu) {
            this.categories.push(categoryToObject(item));
        }
    }, this);
}

module.exports = categories;
