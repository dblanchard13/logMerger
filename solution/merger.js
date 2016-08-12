'use strict';

const _ = require('lodash');

// A helper function I export since it's used in both solutions
const mergeChronologically = (entries, newEntry) => {
  // a few base cases optimizations to save some time
  if(!entries.length){
    entries.push(newEntry);
    return;
  }

  if(entries.length === 1){
    entries[0].date > newEntry.date ? entries.unshift(newEntry) : entries.push(newEntry);
    return;
  }

  if(entries[0].date > newEntry.date){
    entries.unshift(newEntry);
    return;
  }

  if(entries[entries.length - 1].date < newEntry.date){
    entries.push(newEntry);
    return;
  }

  // if none of the base cases are met, dive into the binary search algorithm to find the splice index
  const spliceIdx = findSpliceIndex(entries, newEntry);

  entries.splice(spliceIdx, 0, newEntry);
};

// iterative binary search looking for the splice index
const findSpliceIndex = (entries, newEntry) => {
  const iterations = numTimesDivisibleByTwo(entries.length);
  let leftBound = 0;
  let rightBound = entries.length;

  _.times(iterations, () => {
    const midPoint = rightBound - Math.floor((rightBound - leftBound) / 2);

    if(entries[midPoint].date > newEntry.date){
      rightBound = midPoint;
    }
    else{
      leftBound = midPoint;
    }
  });

  if(rightBound - leftBound === 2){
    if(entries[leftBound + 1].date > newEntry.date){
      return leftBound + 1;
    }
    else{
      return rightBound;
    }
  }
  else if(entries[leftBound].date > newEntry.date){
    return leftBound;
  }
  else if(entries[rightBound].date > newEntry.date){
    return rightBound;
  }
  else{
    return rightBound + 1;
  }
};

// simple helper function for determining how many iterations to go through in the above binary search function
const numTimesDivisibleByTwo = (num) => {
  let count = 0;

  while(Math.floor(num / 2)){
    count ++;
    num = Math.floor(num / 2);
  }

  return count;
};


module.exports = {
  mergeChronologically
};

/*

  Really wanted to do this as tail call recursion since it's considerably cleaner.
  Unfortunately, I don't think it's currently supported by Node. 
  Either that or I'm misunderstanding how to do proper tail call recursion ¯\_(ツ)_/¯

const recursiveFindSpliceIndex = (entries, newEntry, leftBound, rightBound) => {
  leftBound = leftBound || 0;
  rightBound = rightBound || entries.length;

  if(leftBound === rightBound){
    if(entries[leftBound].date > newEntry.date){
      return leftBound;
    }
    else{
      return leftBound + 1;
    }
  }

  const midPoint = rightBound - Math.floor((rightBound - leftBound) / 2);

  if(entries[midPoint].date > newEntry.date){
    rightBound = midPoint;
    return findSpliceIndex(entries, newEntry, leftBound, rightBound);
  }
  else{
    leftBound = midPoint;
    return findSpliceIndex(entries, newEntry, leftBound, rightBound);
  }
};

*/
