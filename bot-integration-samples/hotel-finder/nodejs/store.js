const ReviewsOptions = [
    '“Very stylish, great stay, great staff”',
    '“good hotel awful meals”',
    '“Need more attention to little things”',
    '“Lovely small hotel ideally situated to explore the area.”',
    '“Positive surprise”',
    '“Beautiful suite and resort”'];

const searchHotels = (destination) => {
    return new Promise((resolve, reject) => {
        // Filling the hotels results manually just for demo purposes
        let hotels = Array(5).fill({});
        hotels = hotels.map((hotel, index) => {
            const i = index + 1;
            return {
                name: `${destination} Hotel ${i}`,
                location: destination,
                rating: Math.ceil(Math.random() * 5),
                numberOfReviews: Math.floor(Math.random() * 5000) + 1,
                priceStarting: Math.floor(Math.random() * 450) + 80,
                image: `https://placeholdit.imgix.net/~text?txtsize=35&txt=Hotel+${i}&w=500&h=260`
            };
        });
        hotels.sort((a, b) => { return a.priceStarting - b.priceStarting; });
        // complete promise with a timer to simulate async response
        setTimeout(() => { resolve(hotels); }, 1000);
    });
}

const searchHotelReviews = (hotelName) => {
    return new Promise((resolve, reject) => {
        // Filling the review results manually just for demo purposes
        let reviews = Array(5).fill({});
        reviews = reviews.map(review => {
            return {
                title: ReviewsOptions[Math.floor(Math.random() * ReviewsOptions.length)],
                text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Mauris odio magna, sodales vel ligula sit amet, vulputate vehicula velit.
                Nulla quis consectetur neque, sed commodo metus.`,
                image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/Unknown-person.gif'
            };
        });
        // complete promise with a timer to simulate async response
        setTimeout(() => { resolve(reviews); }, 1000);
    });
}

module.exports = {
    searchHotels,
    searchHotelReviews
};
