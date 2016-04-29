// Yes, these are real: http://en.wikipedia.org/wiki/Gender-specific_and_gender-neutral_pronouns#Summary
tumblr.resources.pronouns = [
	['ey', 'em', 'eir'],
	['tho', 'thong', 'thors'],
	['hu', 'hum', 'hus'],
	['thon', 'thon', 'thons'],
	['jee', 'jem', 'jeir'],
	['ve', 'ver', 'vis'],
	['xe', 'xem', 'xyr'],
	['ze', 'zir', 'zes'],
	['ze', 'hir', 'hir'],
	['ze', 'mer', 'zer'],
	['zhe', 'zhim', 'zher'],
]

tumblr.resources.joinedPronouns = (function () {
	var ret = []
	_.forEach(tumblr.resources.pronouns, function (pronouns) {
		ret.push(pronouns.join('/'))
	})
	return ret
})()
