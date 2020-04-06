export let handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  let el = e.currentTarget;
  let parent = el.parentNode;
  if (parent) parent.removeChild(el);
};
