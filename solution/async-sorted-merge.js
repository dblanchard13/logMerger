'use strict'

// third party libraries
const async = require('async');
const _ = require('lodash');

// merger service used by both solutions
const merger = require('./merger');

module.exports = (logSources, printer) => {
  // pop off the most recent entry from each source asynchronously
  // print off the most recent entry of the group and pop off another from that source asynchronously
    // rinse and repeat until all sources have been drained
  const promises = _.map(logSources, (source) => source.popAsync() );
  const entries = [];

  Promise.all(promises)
    .then((results) => {
      // get the oldest entry for each source and merge it into the array of entries
      _.each(results, (entry, idx) => {
        if(entry){
          entry.id = idx; // keep a reference to the entries corresponding log source
          merger.mergeChronologically(entries, entry);
        }
      });

      // pulled in the async library so I could reason about this solution in much the same way I did for the synchronous solution
      // another way I was thinking about going with this would have been to use node's events module, but I felt this would be considerably cleaner
      async.whilst(undrainedLogs, print, done);
    })
    .catch(console.log); // the most basic of error handling

  const print = (done) => {
    const entry = entries.shift();
    printer.print(entry);

    logSources[entry.id].popAsync()
    .then((newEntry) => {
      if(newEntry){
        newEntry.id = entry.id;
        merger.mergeChronologically(entries, newEntry);
      }

      done(); // let the whilst loop know it should reevaluate the predicate function to determine whether to run again
    })
    .catch(console.log);
  };

  const undrainedLogs = () => { return entries.length; };

  const done = () => { printer.done(); }; // done!!

};
