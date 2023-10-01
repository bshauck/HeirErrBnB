const { validateReview } = require('../../utils/validation');
const { fitsAuthor, requireAuth } = require('../../utils/auth');
const { Review, ReviewImage, Spot, SpotImage, User  } = require('../../db/models');
const router = require('express').Router();

// Create and return a new image for current user's review by reviewId.
router.post('/:reviewId(\\d+)/images', requireAuth,
async (req, res, next) => {
    const oldReview = await Review.findByPk(req.params.reviewId);
    if (!oldReview) return res.status(404).json({message: "Review couldn't be found"});
    else if (fitsAuthor(req, next, oldReview.userId)) {
        const existingImages = await ReviewImage.count({
            where: {reviewId: req.params.reviewId}
        });
        if (existingImages >= 10)
            return res.status(403).json({message: "Maximum number of images for this resource was reached"});
        const {url} = req.body;
        let values;
        if (!Array.isArray(url)) values = [{url}];
        values = url.map(u => {return {reviewId: oldReview.id, url: u}});
        let images = await ReviewImage.bulkCreate(values); // may need {returning:true} for PGSQL
        if (images) {
            images = images.map(i=>{
                let image = i.toJSON()
                delete image.spotId;
                delete image.createdAt;
                delete image.updatedAt;
                return image });
        }
        return res.status(201).json(images);
    }
    return res.status(500).json("Failure of ReviewImage")
});

router.route('/:reviewId(\\d+)')
    // Delete an existing review of current user's.
    .delete(requireAuth, async (req, res, next) => {
        let review = await Review.findByPk(req.params.reviewId);
        if (!review) return res.status(404).json({message: "Review couldn't be found"});
        if (fitsAuthor(req, next, review.userId)) {
            await review.destroy();
            return res.json({message: "Successfully deleted"});
        }
        else return next(new Error('DELETE /reviews/:id error'));
    })
    // Update and return an existing review of current user's.
    .put(requireAuth, validateReview, async (req, res, next) => {
        const oldReview = await Review.unscoped().findByPk(req.params.reviewId);
        if (!oldReview) return res.status(404).json({message: "Review couldn't be found"});
        if (fitsAuthor(req, next, oldReview.userId)) {
            const {review, stars} = req.body;
            if (review) oldReview.review = review;
            if (stars) oldReview.stars = stars;
            await oldReview.save();
            return res.json(oldReview)
        } else return next(new Error('PUT /reviews/:id error'))
    });

// Returns all reviews written by current user.
router.get('/current', requireAuth, async (req, res) => {
    let Reviews = await Review.findAll({
        include: [
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: Spot,
            attributes: {exclude: ['description', 'createdAt', 'updatedAt']},
            include: {model: SpotImage,
                        where: {preview: true}}
/home/shauck/aa-projects/project/HeirErrBnb/backend/db/seeders            },
            {model: ReviewImage, attributes: ['id', 'url']}
        ],
        where: {userId: req.user.id},
        order: [["updatedAt", "DESC"]]
    });
    Reviews = Reviews.map(e=>e.toJSON());
    Reviews.forEach(b=> { let value = b.Spot && b.Spot.SpotImages && b.Spot.SpotImages.length ? b.Spot.SpotImages[0].url : null; b.Spot.previewImage = value; delete b.Spot.SpotImages});
    return res.json({Reviews});
});


module.exports = router;
