# Blog Detail Page Implementation TODO

## [x] 0. Planning complete ✓

## [x] 1. Create BlogDetailPage.tsx ✓
- New file: frontend/src/pages/BlogDetailPage.tsx  
- useParams to get id, find post, hero layout with prose content

## [ ] 2. Update BlogPage.tsx
- Add Read More Button to each card linking to /blog/{post.id}
- Replace full content with excerpt only

## [x] 3. Update App.tsx ✓
- Add import BlogDetailPage
- Add Route path="/blog/:id" element={<BlogDetailPage />}

## [ ] 4. Test locally
- cd frontend &amp;&amp; npm run dev
- /blog → click Read More → verify detail view &amp; back navigation

**Next:** DB migration for blogs/events (admin CRUD) after frontend complete.

