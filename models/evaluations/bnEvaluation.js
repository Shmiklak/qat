const mongoose = require('mongoose');
const baseSchema = require('./base');

const bnEvaluationSchema = new mongoose.Schema({
    ...baseSchema,
    consensus: { type: String, enum: ['fullBn', 'probationBn', 'removeFromBn'] },
    deadline: { type: Date , required: true },
    addition: { type: String, enum: ['lowActivity', 'resignedOnGoodTerms', 'resignedOnStandardTerms', 'none'] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

class BnEvaluationService {

    get kind () {
        return 'currentBn';
    }

    static findActiveEvaluations() {
        let minDate = new Date();
        minDate.setDate(minDate.getDate() + 14);

        return BnEvaluation
            .find({
                active: true,
                deadline: { $lte: minDate },
            })
            .populate([
                {
                    path: 'user',
                    select: 'username osuId modesInfo groups',
                },
                {
                    path: 'natEvaluators',
                    select: 'username osuId',
                },
                {
                    path: 'reviews',
                    select: 'evaluator behaviorComment moddingComment vote',
                    populate: {
                        path: 'evaluator',
                        select: 'username osuId groups',
                    },
                },
            ])
            .sort({ deadline: 1, consensus: 1, feedback: 1 });
    }

    static deleteUserActiveEvaluations(userId) {
        let minDate = new Date();
        minDate.setDate(minDate.getDate() + 14);

        return BnEvaluation.deleteMany({
            user: userId,
            active: true,
            deadline: { $gte: minDate },
        });
    }

}

bnEvaluationSchema.loadClass(BnEvaluationService);
/**
 * @type {import('../interfaces/evaluations').IBnEvaluationModel}
 */
const BnEvaluation = mongoose.model('EvalRound', bnEvaluationSchema);

module.exports = BnEvaluation;
