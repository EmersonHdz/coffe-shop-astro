<?php

/**
 * Theme setup function
 *
 * @package coffe shopv1
 * 
 **/
function coffe_shop_setup() {

  add_theme_support('post-thumbnails');
  add_theme_support('title-tag');

}
add_action('after_setup_theme', 'coffe_shop_setup');


add_filter('acf/settings/rest_api_format', function(){
    return "standard";
});


function coffe_shop_api_init() {
    // Register custom fields for featured image and post categories
     register_rest_field(
        array('page', 'post', 'product'), 'featured_image',
        array(
            'get_callback' => 'get_featured_image')
        );
    // Register custom field for post categories
        register_rest_field(
            array('post'),  'category_details',
            array('get_callback' => 'get_post_category_details')
        );

        // Register custom field for post categories
        register_rest_field(
            array('page'),  'gallery',
            array('get_callback' => 'get_gallery_category_images')
        );

        

}

add_action('rest_api_init', 'coffe_shop_api_init');


function get_featured_image($post) {
     if(!$post['featured_media']) {
        return false;
     }

    $image_sizes = get_intermediate_image_sizes();


    $images = array();
    foreach($image_sizes as $size) {
        if($size === '2048x2048') continue; // Skip '1536x1536' size as it is not needed
        $image = wp_get_attachment_image_src($post['featured_media'], $size);
        
        $images [$size === '1536x1536' ? 'full' : $size] = array(
            'url' => $image[0],
            'width' => $image[1],
            'height' => $image[2],
        );
    }

    return $images;
}

function get_post_category_details($post) {
    return array_map(
        function($category_id) {
            $category = get_category($category_id, ARRAY_A );
     
            return [
                'id' => $category['term_id'],
                'name' => html_entity_decode($category['name'], ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                'slug' => $category['slug'],
            ];
        },
        $post['categories']
    );
}


function get_gallery_category_images($post) {
    if($post['slug'] !== 'gallery') {
        return [];
    }

    $gallery = get_post_gallery($post['id'], false);
    $gallery_ids = array_map('intval', explode(',', $gallery['ids']));

    return array_map(
        function($image_id) {
            $large_image = wp_get_attachment_image_src($image_id, 'large');

             $full_image = wp_get_attachment_image_src($image_id, 'full');

             return [
                'large' =>[
                    'url' => $large_image[0],
                    'width' => $large_image[1],
                    'height' => $large_image[2],
                ],
                   'full' =>[
                    'url' => $full_image[0],
                    'width' => $full_image[1],
                    'height' => $full_image[2],
                   ],    
            ];
        },
        $gallery_ids
    );
}