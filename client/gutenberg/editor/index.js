/**
 * External dependencies
 */
import page from 'page';
import { recordTracksEvent } from '@automattic/calypso-analytics';

/**
 * Internal dependencies
 */
import { siteSelection, sites } from 'my-sites/controller';
import { authenticate, post, redirect, siteEditor, exitPost } from './controller';
import config from 'config';
import { makeLayout, render as clientRender } from 'controller';

function trackOldRouteRedirect( postType, siteId, postId ) {
	const props = {};
	if ( postType ) {
		props.post_type = postType;
	}

	if ( siteId ) {
		props.site_id = siteId;
	}

	if ( postId ) {
		props.post_id = postId;
	}

	recordTracksEvent( `calypso_editor_old_route_redirect`, props );
}

export default function () {
	page(
		'/site-editor/:site?',
		siteSelection,
		redirect,
		authenticate,
		siteEditor,
		makeLayout,
		clientRender
	);

	page( '/post', siteSelection, sites, makeLayout, clientRender );

	page( '/post/new', () => page.redirect( '/post' ) ); // redirect from beep-beep-boop

	page(
		'/post/:site/:post?',
		siteSelection,
		redirect,
		authenticate,
		post,
		makeLayout,
		clientRender
	);

	page( '/post/:site?', siteSelection, redirect, makeLayout, clientRender );

	page.exit( '/post/:site?/:post?', exitPost );

	page( '/page', siteSelection, sites, makeLayout, clientRender );

	page( '/page/new', () => page.redirect( '/page' ) ); // redirect from beep-beep-boop

	page(
		'/page/:site/:post?',
		siteSelection,
		redirect,
		authenticate,
		post,
		makeLayout,
		clientRender
	);
	page( '/page/:site?', siteSelection, redirect, makeLayout, clientRender );

	page.exit( '/page/:site?/:post?', exitPost );

	if ( config.isEnabled( 'manage/custom-post-types' ) ) {
		page( '/edit/:customPostType', siteSelection, sites, makeLayout, clientRender );
		page(
			'/edit/:customPostType/:site/:post?',
			siteSelection,
			redirect,
			authenticate,
			post,
			makeLayout,
			clientRender
		);
		page( '/edit/:customPostType/:site?', siteSelection, redirect, makeLayout, clientRender );
	}

	// Redirect old block-editor routes.
	page( '/block-editor/post/', '/post' );
	page( '/block-editor/post/:site/:post?', ( { params = {} } ) => {
		const { site, post: postId } = params;
		trackOldRouteRedirect( 'post', site, postId );
		if ( postId ) {
			return page.redirect( `/post/${ site }/${ postId }` );
		}
		page.redirect( `/post/${ site }/` );
	} );

	page( '/block-editor/page/', '/page' );
	page( '/block-editor/page/:site/:page?', ( { params = {} } ) => {
		const { site, page: pageId } = params;
		trackOldRouteRedirect( 'page', site, pageId );

		if ( pageId ) {
			return page.redirect( `/page/${ site }/${ pageId }` );
		}
		page.redirect( `/page/${ site }/` );
	} );

	page( '/block-editor/:site', ( context ) => page.redirect( `/post/${ context.params.site }` ) );
}
