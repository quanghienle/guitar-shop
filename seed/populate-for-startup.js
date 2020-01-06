var Product     = require('../models/product');
var User        = require('../models/user');
var mongoose    = require('mongoose');

mongoose.connect('mongodb://localhost/shoppingApp',function(err){
    if (err) throw err;
    console.log('Successfully connected to mongodb\n');

    //Clearing existing products
    Product.remove({},function(err){
        if(err){
            console.log('ERROR: Remove failed');
            return;
        }

        //Creating new products
        let products = [
            new Product({
                imagePath   : 'https://stevesmusic.com/media/catalog/product/cache/1/small_image/274x/0dc2d03fe217f8c83829496872af24a0/3/7/37771_godin.jpg',
                title       : 'Godin 5th Avenue Kingpin',
                description : 'Acoustic Guitar',
                price       : 669.00
            }),
            new Product({
                imagePath   : 'https://stevesmusic.com/media/catalog/product/cache/1/small_image/274x/0dc2d03fe217f8c83829496872af24a0/b/1/b18blackcw4t.jpg',
                title       : 'Norman B18 CW Black 4T',
                description : 'Acoustic Guitar',
                price       : 579.99
            }),
            new Product({
                imagePath   : 'https://stevesmusic.com/media/catalog/product/cache/1/small_image/274x/0dc2d03fe217f8c83829496872af24a0/7/9/79494-godinmultgrconsa.jpg',
                title       : 'Godin Multiac Grand Concert SA 12817',
                description : 'Classical Guitar',
                price       : 1599.99
            }),
            new Product({
                imagePath   : 'https://stevesmusic.com/media/catalog/product/cache/1/small_image/274x/0dc2d03fe217f8c83829496872af24a0/6/6/6616.jpg',
                title       : 'YAMAHA NCX1200R',
                description : 'Classical Guitar',
                price       : 679.99
            }),
            new Product({
                imagePath   : 'https://stevesmusic.com/media/catalog/product/cache/1/small_image/274x/0dc2d03fe217f8c83829496872af24a0/T/B/TBlack.jpg',
                title       : 'Peavey Raptor Plus EXP transparent black',
                description : 'Electric Guitar',
                price       : 279.99
            }),
            new Product({
                imagePath   : 'https://stevesmusic.com/media/catalog/product/cache/1/small_image/274x/0dc2d03fe217f8c83829496872af24a0/2/2/22889b.jpg',
                title       : 'Jay Turser JJ45 Acoustic Guitar Trans Blue',
                description : 'Acoustic Bass',
                price       : 409.75
            }),
            new Product({
                imagePath   : 'https://stevesmusic.com/media/catalog/product/cache/1/small_image/274x/0dc2d03fe217f8c83829496872af24a0/7/0/70951.png',
                title       : 'Eddy Finn - EF-9-S Herringbone Mahogany Soprano Ukulele',
                description : 'Ukulele',
                price       : 169.99
            }),
            new Product({
                imagePath   : 'https://stevesmusic.com/media/catalog/product/cache/1/small_image/274x/0dc2d03fe217f8c83829496872af24a0/7/0/70325.png',
                title       : 'Mahalo - U-Smile PK U-SMile Ukulele',
                description : 'Ukulele',
                price       : 99.55
            }),
            new Product({
                imagePath   : 'https://stevesmusic.com/media/catalog/product/cache/1/small_image/274x/0dc2d03fe217f8c83829496872af24a0/6/8/68582.png',
                title       : 'Kala – Ukulele “KA-SU-SKULLS”',
                description : 'Ukulele',
                price       : 129.50
            }),
            new Product({
                imagePath   : 'https://stevesmusic.com/media/catalog/product/cache/1/small_image/274x/0dc2d03fe217f8c83829496872af24a0/O/v/Ovation2778ax5.jpg',
                title       : 'Ovation Standard Elite 2778AX-5',
                description : 'Acoustic Guitar',
                price       : 779.00
            })
        ];

        //Adding created products to database
        for (let i = 0; i < products.length; i++){
            products[i].save(function(err, result) {
                console.log(`saving: ${products[i].title}, ${products[i].price}`);
            });
        }
    });

    //Clearing existing Users
    User.remove({},function(err){
        if(err){
            console.log('ERROR: Remove failed');
            return;
        }

        //Creating new users
        let Users = [];
        //User 1
        Users.push(new User({
            username    : 'admin@admin.com',
            password    : 'admin',
            fullname    : 'Admin',
            admin       : true
        }));
        //User 2
        Users.push(new User({
            username    : 'guitarshop@music.com',
            password    : 'guitar',
            fullname    : 'Hien Le',
            admin       : true
        }));

        //Adding created users to database then disconnect
        for(let i = 0; i < Users.length; i++){
            var newUser = Users[i];
            User.createUser(newUser, function(err, user){
                if(err) throw err;
                console.log(user);

                if (i === Users.length - 1){
                    mongoose.disconnect();
                    }
            });
        }
    });

});
