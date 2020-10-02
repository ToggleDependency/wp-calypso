/**
 * Internal dependencies
 */
import 'state/data-layer/wpcom/sites/scan';

/**
 * Returns an array found threats in the current scan process of Jetpack Scan.
 * Returns an empty array if the site is unknown, or there is no information yet.
 *
 * @param  {object}   state    		Global state tree
 * @param  {number}   siteId   		The ID of the site we're querying
 * @returns {[key: string]: number} Array of threat counts, by status
 */
export default function getSiteScanThreatCounts( state, siteId ) {
	return state.jetpackScan.threatCounts.data?.[ siteId ] || [];
}
