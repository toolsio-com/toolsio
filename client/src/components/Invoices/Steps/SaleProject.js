import React from "react";
import { Link } from "react-router-dom";
// Semantic UI Form elements
import {
  Dropdown,
  Form,
  Header,
  Icon,
  Button,
  Message
} from "semantic-ui-react";

// Localization
import T from "i18n-react";

export default function SaleProject({
  id,
  step1,
  salesOption,
  projectsOption,
  handleChange,
  handleSearchChangeProject,
  handleSearchChangeSale,
  handleNext,
  errors
}) {
  return (
    <Form>
      <div className="inline field">
        {id ? (
          <h1 className="ui header">
            {T.translate("invoices.form.edit_invoice")}
          </h1>
        ) : (
          <Header as="h1">
            {T.translate("invoices.form.new_invoice")}
            <Header.Subheader className="d-inline-block pl-1">
              {T.translate("invoices.form.sale_or_project")}
            </Header.Subheader>
          </Header>
        )}
      </div>

      <Message info size="small">
        <Message.Content>
          {T.translate("invoices.form.sale_or_project_info")}
        </Message.Content>
      </Message>
      <fieldset className="custom-fieldset">
        <legend className="custom-legend">
          {T.translate("invoices.form.select_sale_or_project")}
        </legend>

        <Form.Field inline error={!!errors.saleId}>
          <label>{T.translate("invoices.form.sale")}</label>
          <Dropdown
            placeholder={T.translate("invoices.form.select_sale")}
            name="saleId"
            value={step1.sale ? step1.sale.id : ""}
            onChange={(e, { value }) => handleChange("saleId", value)}
            onSearchChange={handleSearchChangeSale}
            error={!!errors.sale}
            options={salesOption ? salesOption : []}
            search
            selection
          />
          <span className="red">{errors.saleId}</span>
        </Form.Field>

        <div className="ui horizontal divider">Or</div>

        <Form.Field inline error={!!errors.projectId}>
          <label>{T.translate("invoices.form.project")}</label>
          <Dropdown
            label={T.translate("invoices.form.projects")}
            placeholder={T.translate("invoices.form.select_project")}
            name="projectId"
            value={step1.project ? step1.project.id : ""}
            onChange={(e, { value }) => handleChange("projectId", value)}
            onSearchChange={handleSearchChangeProject}
            options={projectsOption ? projectsOption : []}
            search
            selection
            selectOnBlur={false}
          />
          <span className="red">{errors.projectId}</span>
        </Form.Field>
      </fieldset>

      <div className="inline field mt-5">
        <Link to="/invoices" className="ui primary outline button">
          <Icon name="minus circle" />
          {T.translate("invoices.form.cancel")}
        </Link>
        <Button primary onClick={handleNext}>
          {T.translate("invoices.form.next")}
          <Icon name="chevron right" />
        </Button>
      </div>
    </Form>
  );
}
