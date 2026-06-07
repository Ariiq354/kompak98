import ModalConfirm from "~/components/Modal/ModalConfirm.vue";

const overlay = useOverlay();
export function openModal(
  component: any,
  props: object,
) {
  const modal = overlay.create(component, {
    props,
  });

  return modal.open();
}
export function openConfirmModal(
  path: string,
  body: object,
  refresh: () => void,
) {
  const modal = overlay.create(ModalConfirm, {
    props: {
      path,
      body,
      refresh,
    },
  });

  modal.open();
}
