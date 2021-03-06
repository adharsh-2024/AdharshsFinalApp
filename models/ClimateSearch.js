
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var toDoItemSchema = Schema( {
  searchname: String,
  country:String,
  frequency:String,
  feature:String,
  startYear:String,
  endYear:String,
  userId: ObjectId
} );

module.exports = mongoose.model( 'ToDoItem', toDoItemSchema );
