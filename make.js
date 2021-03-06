const fs = require('fs');
const faker = require('faker');

const imagesCategory = 'transport';

const apiURL = 'https://react-commerce-api.herokuapp.com';

const mockBanner = [
    `${apiURL}/images/banner-mobile.png`,
    `${apiURL}/images/banner.png`,
];

const getImage = (width = false, height = false) => `${faker.image.imageUrl(width, height, imagesCategory, false, true)}/`;

const generateData = () => {
    const discounts = [10, 15, 30, 55];

    const qty = {
        products: 600,
        categories: 8,
        related: 20,
    };

    const data = {
        store: {
            company: 'React Commerce LTDA',
            phone: '+55 11 0000-0000',
            email: 'hello@react-commerce.com',
        },
        categories: [],
        products: [],
        banners: [
            mockBanner,
            mockBanner,
            mockBanner,
        ],
        cart: [],
    };

    const mathRandom = n => {
        return Math.floor(Math.random() * n) + 1;
    };

    const createArray = (size, ids) => {
        const n = mathRandom(size);
        const generated = [];
        new Array(n).fill(null).forEach(() => {
            const id = mathRandom(ids);
            if (generated.indexOf(id) >= 0) return;
            generated.push(id);
        });

        return generated.sort();
    };

    const randomProducts = () => {
        return createArray(qty.related, qty.products);
    };

    const randomCategory = () => {
        return createArray(qty.categories, qty.categories);
    };

    const randomGallery = () => {
        return new Array(6).fill(getImage());
    };

    const getSpecialPrice = price => {
        const index = mathRandom(discounts.length);
        return price - (price * discounts[index]) / 100;
    };

    const rating = [3,4,5];
    for (let i = 1; i <= qty.products; i++) {
        const product = {
            id: i + 1,
            title: faker.commerce.productName(),
            qty: mathRandom(1000),
            price: faker.commerce.price(),
            short_description: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            thumbnail: getImage(),
            gallery: randomGallery(),
            categories: randomCategory(),
            related: randomProducts(),
            rating: rating[mathRandom(rating.length)],
        };

        if (Math.random() >= 0.8) {
            product.special_price = getSpecialPrice(product.price);
        }

        data.products.push(product);
    }

    for (let i = 1; i <= qty.categories; i++) {
        data.categories.push({
            id: i + 1,
            title: faker.commerce.department(),
            short_description: faker.lorem.sentence(),
            banner: [
                getImage(1024, 600),
                getImage(768, 320),
            ]
        });
    }

    const productQty = qty.products;
    for (let i = 0; i < 3; i++) {
        const { id, thumbnail: image, title: name, price, qty } = data.products[mathRandom(productQty)];
        data.cart.push({ id, image, name, price, qty });
    }

    return data;
};

module.exports = (filename, callback) => {
    if (!callback) return false;

    const data = generateData();
    fs.writeFile(filename, JSON.stringify(data, null, '\t'), err => {
        if (err) throw err;
        callback();
    });
};
