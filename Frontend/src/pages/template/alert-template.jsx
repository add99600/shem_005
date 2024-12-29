function AlertTemplate({
  title = "success!",
  message = "success message",
  alertType = "success",
  show = true,
}) {
  return (
    <div
      class={`alert alert-dismissible fade ${
        show ? "show" : null
      } alert-${alertType}`}
    >
      <strong class="me-2">{title}</strong>
      {message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  );
}

export default AlertTemplate;
