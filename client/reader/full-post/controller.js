/**
 * External Dependencies
 */
import React from 'react';
import page from 'page';
import { defer } from 'lodash';

/**
 * Internal Dependencies
 */
import { trackPageLoad } from 'reader/controller-helper';
import FullPostView from 'blocks/reader-full-post';

const analyticsPageTitle = 'Reader';

const scrollTopIfNoHash = () =>
	defer( () => {
		if ( typeof window !== 'undefined' && ! window.location.hash ) {
			window.scrollTo( 0, 0 );
		}
	} );

export function blogPost( context, next ) {
	const blogId = context.params.blog;
	const postId = context.params.post;
	const basePath = '/read/blogs/:blog_id/posts/:post_id';
	const fullPageTitle = analyticsPageTitle + ' > Blog Post > ' + blogId + ' > ' + postId;

	let referral;
	if ( context.query.ref_blog && context.query.ref_post ) {
		referral = { blogId: context.query.ref_blog, postId: context.query.ref_post };
	}

	trackPageLoad( basePath, fullPageTitle, 'full_post' );

	function closer() {
		page.back( context.lastRoute || '/' );
	}

	context.primary = (
		<FullPostView
			blogId={ blogId }
			postId={ postId }
			referral={ referral }
			referralStream={ context.lastRoute }
			onClose={ closer }
		/>
	);
	scrollTopIfNoHash();
	next();
}

export function feedPost( context, next ) {
	const feedId = context.params.feed;
	const postId = context.params.post;
	const basePath = '/read/feeds/:feed_id/posts/:feed_item_id';
	const fullPageTitle = analyticsPageTitle + ' > Feed Post > ' + feedId + ' > ' + postId;

	trackPageLoad( basePath, fullPageTitle, 'full_post' );

	function closer() {
		page.back( context.lastRoute || '/' );
	}

	context.primary = (
		<FullPostView
			feedId={ feedId }
			postId={ postId }
			onClose={ closer }
			referralStream={ context.lastRoute }
		/>
	);
	scrollTopIfNoHash();
	next();
}
