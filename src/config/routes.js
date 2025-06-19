import MyTrips from '@/components/pages/MyTrips';
import Search from '@/components/pages/Search';
import Itinerary from '@/components/pages/Itinerary';
import Budget from '@/components/pages/Budget';
import Guides from '@/components/pages/Guides';

export const routes = {
  myTrips: {
    id: 'myTrips',
    label: 'My Trips',
    path: '/',
    icon: 'MapPin',
    component: MyTrips
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search
  },
  itinerary: {
    id: 'itinerary',
    label: 'Itinerary',
    path: '/itinerary',
    icon: 'Calendar',
    component: Itinerary
  },
  budget: {
    id: 'budget',
    label: 'Budget',
    path: '/budget',
    icon: 'DollarSign',
    component: Budget
  },
  guides: {
    id: 'guides',
    label: 'Guides',
    path: '/guides',
    icon: 'BookOpen',
    component: Guides
  }
};

export const routeArray = Object.values(routes);
export default routes;