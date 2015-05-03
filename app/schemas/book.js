var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
var BookSchema = new Schema({
	title:String,
	author:String,
	publisher:String,
	price:String,
	summary:String,
	isbn:String,
	cover:String,
	year:String,
	category: {
		type: ObjectId,
		ref: 'Category'
	},
	pv: {
		type: Number,
		default: 0
	},
	meta:{
		createdAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})
BookSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createdAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}
	next()
})
BookSchema.statics={
	feach: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id,cb){
		return this
			.findOne({_id: id})
			.exec(cb)
	}
}
module.exports = BookSchema