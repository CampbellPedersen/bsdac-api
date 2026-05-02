import { useContext, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Rap } from '../api/raps/types';
import { AppContext } from '../context';
import { getSelectedRapRouteState } from './route-state';

export const useNavigateToRap = () => {
  const navigate = useNavigate();

  return useMemo(
    () => (rap: Rap) => navigate(`/raps/${rap.id}`),
    [navigate]
  );
};

export const useVisibleRaps = (raps: Rap[]) => {
  const {
    raps: { queue },
  } = useContext(AppContext);

  return useMemo(
    () => raps.filter((rap) => queue?.includes(rap.id)),
    [queue, raps]
  );
};

export const useSelectedRapFromRoute = (raps: Rap[]) => {
  const { rapId } = useParams<{ rapId: string }>();
  const { search } = useLocation();

  return useMemo(() => {
    return getSelectedRapRouteState(raps, rapId, search);
  }, [rapId, raps, search]);
};
