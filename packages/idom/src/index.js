import { IDom } from './IDom';
import './IDomAnimationManager';
import './IDomAttributeManager';
import './IDomEventManager';
import './IDomStyleManager';
import './IDomTreeManager';
import './IDomUtilManager';

export * from './IDom';
export * from './IDomUtils';

export default function (element) {
  return new IDom(element);
}
