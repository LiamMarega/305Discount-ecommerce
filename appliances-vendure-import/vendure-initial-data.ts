import { InitialData, LanguageCode } from '@vendure/core';

export const initialData: InitialData = {
  defaultLanguage: LanguageCode.en,
  countries: [
    { name: 'United States', code: 'US', zone: 'United States' },
  ],
  defaultZone: 'United States',
  taxRates: [
    { name: 'standard', percentage: 0 },
  ],
  shippingMethods: [
    { name: 'Standard Shipping', price: 0 },
  ],
  paymentMethods: [
    {
      name: 'Standard Payment',
      handler: {
        code: 'dummy-payment-handler',
        arguments: [{ name: 'automaticSettle', value: 'false' }],
      },
    },
  ],
  collections: [
    {
        "name": "Bosh Fridge",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:Bosh Fridge"
                    ],
                    "containsAny": false
                }
            }
        ]
    },
    {
        "name": "BRAND NEW",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:BRAND NEW"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/BRAND_NEW_LOGO.png?v=1726504092"
        ]
    },
    {
        "name": "DRYERS",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:DRYERS"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/DRYER_ICON_fbaf0150-a9af-4701-8af6-2331f8331a89.png?v=1726605667"
        ]
    },
    {
        "name": "FRIDGE",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:FRIDGE"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/FRIDGE_PNG_ICON_2.png?v=1726605952"
        ]
    },
    {
        "name": "KENMORE",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:KENMORE"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/KENMORE.jpg?v=1726605976"
        ]
    },
    {
        "name": "KENMORE BRAND NEW",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:KENMORE BRAND NEW"
                    ],
                    "containsAny": false
                }
            }
        ]
    },
    {
        "name": "KENMORE OPEN BOX",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:KENMORE OPEN BOX"
                    ],
                    "containsAny": false
                }
            }
        ]
    },
    {
        "name": "LG",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:LG"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/LG.png?v=1726605118"
        ]
    },
    {
        "name": "LG BRAND NEW",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:LG BRAND NEW"
                    ],
                    "containsAny": false
                }
            }
        ]
    },
    {
        "name": "LG OPEN BOX",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:LG OPEN BOX"
                    ],
                    "containsAny": false
                }
            }
        ]
    },
    {
        "name": "MICROWAVES",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:MICROWAVES"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/MICROWAVES_PNG_ICON_8d6bad9f-87e4-450f-8bfd-4f98b8114547.png?v=1726605803"
        ]
    },
    {
        "name": "OPEN BOX",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:OPEN BOX"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/OPEN_BOX.jpg?v=1727218445"
        ]
    },
    {
        "name": "SAMSUNG",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:SAMSUNG"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/SAMSUNG.png?v=1726605133"
        ]
    },
    {
        "name": "SAMSUNG BRAND NEW",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:SAMSUNG BRAND NEW"
                    ],
                    "containsAny": false
                }
            }
        ]
    },
    {
        "name": "SAMSUNG FRIDGE OPEN BOX",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:SAMSUNG FRIDGE OPEN BOX"
                    ],
                    "containsAny": false
                }
            }
        ]
    },
    {
        "name": "SAMSUNG OPEN BOX",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:SAMSUNG OPEN BOX"
                    ],
                    "containsAny": false
                }
            }
        ]
    },
    {
        "name": "SETS",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:SETS"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/photo_5140871099792338367_m.jpg?v=1726649497"
        ]
    },
    {
        "name": "SHOP BY BRAND",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:SHOP BY BRAND"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/SHOP.png?v=1726606107"
        ]
    },
    {
        "name": "STOVES",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:STOVES"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/STOVE_PNG_ICON_7cbee1d7-6ffb-4ee7-ade5-8a5fb0bcc467.png?v=1726605748"
        ]
    },
    {
        "name": "Washer",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:Washer"
                    ],
                    "containsAny": false
                }
            }
        ]
    },
    {
        "name": "WHIRLPOOL",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:WHIRLPOOL"
                    ],
                    "containsAny": false
                }
            }
        ],
        "assetPaths": [
            "https://cdn.shopify.com/s/files/1/0622/9449/1190/collections/Whirlpool.jpg?v=1726605339"
        ]
    },
    {
        "name": "WHIRLPOOL OPEN BOX",
        "filters": [
            {
                "code": "facet-value-filter",
                "args": {
                    "facetValueNames": [
                        "collection:WHIRLPOOL OPEN BOX"
                    ],
                    "containsAny": false
                }
            }
        ]
    }
],
};
