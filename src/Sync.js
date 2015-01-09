module.exports = function Sync(gen) {
	var iter, resume;
	resume = function(err, ret) {
		if(err) iter.raise(err);
		iter.next(ret);
	};
	iter = gen(resume);
	iter.next()
};