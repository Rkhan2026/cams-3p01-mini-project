# Implementation Plan

- [x] 1. Create consolidated icons file and extract inline icons



  - Create `components/ui/icons.js` file with all existing icons from components/icons/ directory
  - Extract inline icon definitions from dashboard pages and add them to the consolidated file
  - Ensure all icons follow the standardized component pattern with className and props support




  - _Requirements: 1.1, 1.2, 3.1, 3.2, 3.3_

- [x] 2. Update TPO dashboard pages to use consolidated icons


  - [ ] 2.1 Update TPO main dashboard page imports
    - Modify `app/(dashboards)/tpo/page.js` to import icons from `components/ui/icons.js`


    - Remove old import from `components/icons`






    - _Requirements: 2.1, 2.2, 1.4_

  - [x] 2.2 Update TPO reports page imports


    - Modify `app/(dashboards)/tpo/reports/page.js` to import ArrowLeftIcon from consolidated file
    - _Requirements: 2.1, 2.2, 1.4_



  - [ ] 2.3 Update TPO jobs page imports
    - Modify `app/(dashboards)/tpo/jobs/page.js` to import ArrowLeftIcon from consolidated file






    - _Requirements: 2.1, 2.2, 1.4_



- [ ] 3. Update student dashboard pages to use consolidated icons
  - [x] 3.1 Update student main dashboard page imports


    - Modify `app/(dashboards)/student/page.js` to import icons from consolidated file
    - Remove old import from `components/icons`
    - _Requirements: 2.1, 2.2, 1.4_



  - [x] 3.2 Update student jobs listing page



    - Modify `app/(dashboards)/student/jobs/page.js` to import all icons from consolidated file
    - Remove inline MoneyIcon definition and use consolidated version
    - _Requirements: 2.1, 2.2, 1.3, 3.1_

  - [x] 3.3 Update student job details page


    - Modify `app/(dashboards)/student/jobs/[id]/page.js` to import all icons from consolidated file
    - _Requirements: 2.1, 2.2, 1.4_

  - [ ] 3.4 Update student applications page imports
    - Modify `app/(dashboards)/student/applications/page.js` to import PlusIcon from consolidated file
    - _Requirements: 2.1, 2.2, 1.4_

- [ ] 4. Update recruiter dashboard pages to use consolidated icons
  - [ ] 4.1 Update recruiter main dashboard page imports
    - Modify `app/(dashboards)/recruiter/page.js` to import icons from consolidated file
    - Remove old import from `components/icons`
    - _Requirements: 2.1, 2.2, 1.4_

  - [ ] 4.2 Update recruiter jobs page imports
    - Modify `app/(dashboards)/recruiter/jobs/page.js` to import ArrowLeftIcon from consolidated file
    - _Requirements: 2.1, 2.2, 1.4_

  - [ ] 4.3 Update recruiter new job page
    - Modify `app/(dashboards)/recruiter/jobs/new/page.js` to import icons from consolidated file
    - Remove inline BackArrowIcon and SpinnerIcon definitions
    - _Requirements: 2.1, 2.2, 1.3, 3.1_

  - [ ] 4.4 Update recruiter applications page
    - Modify `app/(dashboards)/recruiter/applications/page.js` to import all icons from consolidated file
    - Remove inline CheckIcon, XIcon, UserAddIcon, and DownloadIcon definitions
    - _Requirements: 2.1, 2.2, 1.3, 3.1_

- [ ] 5. Clean up and validate consolidation
  - [ ] 5.1 Remove unused icon files and update index
    - Remove or update `components/icons/` directory files if no longer needed
    - Update `components/icons/index.js` if it still exists
    - _Requirements: 1.3, 2.3_

  - [ ] 5.2 Validate all dashboard pages work correctly
    - Test that all dashboard pages load without import errors
    - Verify that all icons display correctly with proper styling
    - _Requirements: 1.4, 3.4_