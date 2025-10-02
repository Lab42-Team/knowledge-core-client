export default {
    MENU: {
        HOME: 'Home',
        NEWS: 'News',
        KNOWLEDGE_CORE: 'General information',
        DEVELOPMENTS: 'Developments',
        CLIENT: 'In client',
    },
    PAGE: {
        HOME: 'Home',
        NEWS: {
            NAME: 'News',
            CREATE: 'Create news',
            VIEW: 'View news',
            EDIT: 'Edit news',
        },
        KNOWLEDGE_CORE: {
            NAME: 'General information',
            EDIT: 'Editing general information',
            EDIT_DESCRIPTION: 'Editing descrription',
            EDIT_REFERENCES: 'Editing references',
        },
        DEVELOPMENTS: {
            NAME: 'Developments',
            CREATE: 'Create developments',
            VIEW: 'View developments',
            EDIT: 'Edit developments',
        },
    },
    BUTTON: {
        EDIT: 'Edit',
        DELETE: 'Delete',
        SAVE: 'Save',
        CREATE_NEWS: 'Create news',
        CREATE_DEVELOPMENT: 'Create development',
        SAVE_CHANGES: 'Save changes',
        LOGOUT: 'Logout',
    },
    TABLE: {
        NEWS: {
            NAME: 'Name',
            STATUS: 'Status',
            DATE: 'Date',
            ACTIONS: 'Actions',
            DESCRIPTION: 'Descrription',
            TOOLTIP_ACTIONS: {
                VIEW: 'View',
                EDIT: 'Edit',
                DELETE: 'Delete',
            },
            SORT: {
                NAME: 'Sort by Name',
                YEAR: 'Sort by Year',
            },
            SEARCH: {
                NAME: 'Enter name',
                BUTTON: 'Search',
            },
            RESET: {
                BUTTON: 'Reset',
            },
            PLACEHOLDER: {
                NAME: 'Enter the name',
                STATUS: 'Select status',
                DATE: 'Select date',
                DESCRIPTION: 'Enter a description',
            },
        },
        KNOWLEDGE_CORE: {
            DESCRIPTION: 'Description',
            PHONE: 'Phone',
            EMAIL: 'Email',
            ADDRESS: 'Address',
            REFERENCES: 'References',
            LAB_LINK: 'Link to the laboratory website',
            LAB_LINK_SHORT: 'Link',
            GITHUB_LINK: 'GitHub group link',
            GITHUB_LINK_SHORT: 'Link to GitHub',
            PLACEHOLDER: {
                DESCRIPTION: 'Enter a description',
                PHONE: 'Enter the phone',
                EMAIL: 'Enter the email',
                ADDRESS: 'Enter the address',
                REFERENCES: 'Enter the references',
                LAB_LINK: 'Enter the link to the laboratory website',
                GITHUB_LINK: 'Enter the gitHub group link',
            },
        },
        DEVELOPMENTS: {
            NAME: 'Name',
            DESCRIPTION: 'Descrription',
            YEAR: 'Year',
            AUTHORS: 'Authors',
            PUBLICATIONS: 'Publications',
            REQUIREMENTS: 'Requirements',
            PRACTICAL_APPLICATION: 'Practical application',
            VERSION_HISTORY: 'Version history',
            DEMO_VIDEOS: 'Demo videos',
            SOFTWARE_LINK: 'Software link',
            DOCUMENTATION_LINK: 'Documentation link',
            GITHUB_LINK: 'Link to GitHub',
            ACTIONS: 'Actions',
            TOOLTIP_ACTIONS: {
                VIEW: 'View',
                EDIT: 'Edit',
                DELETE: 'Delete',
            },
            SORT: {
                NAME: 'Sort by Name',
                DATE: 'Sort by Date',
            },

            SEARCH: {
                NAME: 'Enter name',
                BUTTON: 'Search',
            },
            RESET: {
                BUTTON: 'Reset',
            },

            PLACEHOLDER: {
                NAME: 'Enter the name',
                DESCRIPTION: 'Enter a description',
                YEAR: 'Select year',
                AUTHORS: 'Enter a authors',
                PUBLICATIONS: 'Enter a publications',
                REQUIREMENTS: 'Enter a requirements',
                PRACTICAL_APPLICATION: 'Enter a practical application',
                VERSION_HISTORY: 'Enter a version history',
                DEMO_VIDEOS: 'Enter a demo videos',
                SOFTWARE_LINK: 'Enter a software link',
                DOCUMENTATION_LINK: 'Enter a documentation link',
                GITHUB_LINK: 'Enter a link to GitHub',
            },
        },
    },
    CONFIRM: {
        NEWS: {
            DELETE: 'Are you sure you want to delete this news?',
        },
        DEVELOPMENTS: {
            DELETE: 'Are you sure you want to delete this development?',
        },
    },
    MESSAGE: {
        NEWS: {
            TEXT:{
                DESCRIPTION: 'No data',
            },
            SUCCESS: {
                CREATE: 'News created successfully!',
                EDIT: 'News edited successfully!',
                DELETE: 'News deleted successfully!',
            },
            ERROR: {
                DELETE: 'Error deleting news',
                STATUS: 'Error loading statuses',
                CREATING: 'Error while creating news',
                EDITING: 'Error while editing news',
                ENTER_TITLE: 'Please enter a title',
                TITLE_LONGE: 'Title must be no longer than 255 characters',
                SELECT_STATUS: 'Please select a status',
                SELECT_DATE: 'Please select a date',
            },
        },
        KNOWLEDGE_CORE: {
            SUCCESS: {
                EDIT: 'General information edited successfully!',
            },
            ERROR: {
                EMAIL: 'The email field must be a valid email address.',
                EMAIL_LONGE: 'Email must be no longer than 255 characters',
                EDITING: 'Error while editing general information',
                PHONE_LONGE: 'Phone must be no longer than 255 characters',
                ADDRESS_LONGE: 'Address must be no longer than 255 characters',
            },
        },
        DEVELOPMENTS: {
            SUCCESS: {
                CREATE: 'Developments created successfully!',
                EDIT: 'Developments edited successfully!',
                DELETE: 'Developments deleted successfully!',
            },
            ERROR: {
                CREATING: 'Error while creating developments',
                ENTER_TITLE: 'Please enter a title',
                TITLE_LONGE: 'Title must be no longer than 255 characters',
            },
        },
    },
};
