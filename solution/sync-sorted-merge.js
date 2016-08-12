'use strict'

// third party library
const _ = require('lodash');

// merger service used by both solutions
const merger = require('./merger');


module.exports = (logSources, printer) => {
  // pop off the most recent entry from each source
  // print off the most recent entry of the group and pop off another from that source
    // rinse and repeat until all sources have been drained
  const entries = [];

  // get the oldest entry for each source and merge it into the array of entries
  _.each(logSources, (source, idx) => {
    let entry = source.pop();
    if(entry){
      entry.id = idx;
      merger.mergeChronologically(entries, entry);
    }
  });


  // keep iterating while there are still entries to print
  while(entries.length){
    let entry = entries.shift();

    printer.print(entry);
    let newEntry = logSources[entry.id].pop();

    if(newEntry){
      newEntry.id = entry.id;
      merger.mergeChronologically(entries, newEntry);
    }
  }

  printer.done(); // done!!
};
