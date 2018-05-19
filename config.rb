###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# # Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
  activate :directory_indexes
end

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

activate :sprockets
# https://gist.github.com/jeremyruppel/5751461
module AssetHelper
  ##
  # Renders a stylesheet asset inline.
  def inline_stylesheet(name)
    content_tag :style do
      sprockets["#{name}.css"].to_s
    end
  end

  ##
  # Renders a javascript asset inline.
  def inline_javascript(name)
    content_tag :script do
      sprockets["#{name}.js"].to_s
    end
  end
end
helpers AssetHelper

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  activate :asset_hash, ignore: [%r{^images/static}]

  # Use relative URLs
  activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"

  activate :favicon_maker, :icons => {
    "images/_favicon_template.png" => [
      { icon: "images/apple-touch-icon-152x152-precomposed.png" },
      { icon: "images/apple-touch-icon-144x144-precomposed.png" },
      { icon: "images/apple-touch-icon-114x114-precomposed.png" },
      { icon: "images/apple-touch-icon-72x72-precomposed.png" },
      { icon: "images/favicon.png", size: "16x16" },
      { icon: "images/favicon.ico", size: "64x64,32x32,24x24,16x16" },
    ]
  }

  activate :directory_indexes

  activate :minify_html

  activate :gzip
end

activate :imageoptim do |options|
  # Use a build manifest to prevent re-compressing images between builds
  options.manifest = true

  # Silence problematic imageoptim workers
  options.skip_missing_workers = true

  # Cause imageoptim to be in shouty-mode
  options.verbose = false

  # Setting these to true or nil will let options determine them (recommended)
  options.nice = true
  options.threads = true

  # Image extensions to attempt to compress
  options.image_extensions = %w(.png .jpg .gif .svg)

  # Compressor worker options, individual optimisers can be disabled by passing
  # false instead of a hash
  options.advpng    = { :level => 4 }
  options.gifsicle  = { :interlace => false }
  options.jpegoptim = { :strip => ['all'], :max_quality => 100 }
  options.jpegtran  = { :copy_chunks => false, :progressive => true, :jpegrescan => true }
  options.optipng   = { :level => 6, :interlace => false }
  options.pngcrush  = { :chunks => ['alla'], :fix => false, :brute => false }
  options.pngout    = { :copy_chunks => false, :strategy => 0 }
  options.svgo      = {}
end

# https://middlemanapp.com/advanced/custom-extensions/
class Sync < Middleman::Extension
  def initialize(app, options_hash={}, &block)
    super
  end
end
::Middleman::Extensions.register(:sync, Sync)

configure :sync do
  system 'gsutil -m rm gs://botcraft.io/**'
  Dir.chdir './build/'
  system 'gsutil cp -r * gs://botcraft.io'
end
