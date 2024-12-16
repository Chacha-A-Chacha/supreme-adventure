import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

const Header = ({ title, breadcrumbs = [], actions = [] }) => {
  return (
    <div>
      <div>
        {/* Breadcrumb navigation for mobile and desktop */}
        <nav aria-label="Back" className="sm:hidden">
          <a href="#" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ChevronLeftIcon aria-hidden="true" className="mr-1 -ml-1 h-5 w-5 text-gray-400" />
            Back
          </a>
        </nav>
        <nav aria-label="Breadcrumb" className="hidden sm:flex">
          <ol role="list" className="flex items-center space-x-4">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index}>
                <div className="flex items-center">
                  {index > 0 && (
                    <ChevronRightIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                  )}
                  <a
                    href={breadcrumb.href}
                    className={
                      breadcrumb.current
                        ? 'ml-4 text-sm font-medium text-gray-700'
                        : 'ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'
                    }
                    aria-current={breadcrumb.current ? 'page' : undefined}
                  >
                    {breadcrumb.label}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="mt-2 md:flex md:items-center md:justify-between">
        {/* Title */}
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex shrink-0 md:mt-0 md:ml-4">
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              onClick={action.onClick}
              className={
                action.primary
                  ? 'ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  : 'ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
