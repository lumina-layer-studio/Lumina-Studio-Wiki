import type ArtalkInstance from 'artalk';

type LifecycleTarget = Pick<ArtalkInstance, 'off' | 'on' | 'reload'>;

interface LifecycleCallbacks {
  onReady: () => void;
  onFailed: () => void;
}

export function bindArtalkLifecycle(
  instance: LifecycleTarget,
  {onReady, onFailed}: LifecycleCallbacks,
): () => void {
  const handleMounted = () => {
    instance.reload();
  };
  const handleLoaded = () => {
    onReady();
  };
  const handleFailed = () => {
    onFailed();
  };

  instance.on('mounted', handleMounted);
  instance.on('list-loaded', handleLoaded);
  instance.on('list-failed', handleFailed);

  return () => {
    instance.off('mounted', handleMounted);
    instance.off('list-loaded', handleLoaded);
    instance.off('list-failed', handleFailed);
  };
}
