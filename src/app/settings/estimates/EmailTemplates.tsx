import { useState } from "react";
import { Input, List, Modal } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
import { CiEdit } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";

interface EmailDraft {
  subject: string;
  message: string;
}

export default function EstimateAndInvoicePage() {
  const [emailDrafts, setEmailDrafts] = useState<EmailDraft[]>([
    { subject: "Email Subject 1", message: "Message for Email 1" },
    { subject: "Email Subject 2", message: "Message for Email 2" },
  ]);

  const [newSubject, setNewSubject] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editSubject, setEditSubject] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleAdd = () => {
    if (newSubject.trim() && newMessage.trim()) {
      setEmailDrafts([
        ...emailDrafts,
        { subject: newSubject, message: newMessage },
      ]);
      setNewSubject("");
      setNewMessage("");
    }
  };

  const handleDelete = (index: number) => {
    setEmailDrafts(emailDrafts.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditSubject(emailDrafts[index].subject);
    setEditMessage(emailDrafts[index].message);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (editingIndex !== null) {
      const updatedDrafts = [...emailDrafts];
      updatedDrafts[editingIndex] = {
        subject: editSubject,
        message: editMessage,
      };
      setEmailDrafts(updatedDrafts);
    }
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function sendTemplate(index: number) {
    setNewSubject(emailDrafts[index].subject);
    setNewMessage(emailDrafts[index].message);
  }

  const filterDrafts = emailDrafts.filter((email) =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="flex flex-col items-start gap-4 px-5">
      <div className="w-full space-y-2">
        <h2 className="text-xl font-semibold">
          Create/Edit Draft Email for Sharing Estimate/Invoice
        </h2>
        <div className="overflow:hidden  rounded-sm border bg-white p-5">
          <Input.Search
            placeholder="Search Templates..."
            className="mb-4"
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
          <div className="max-h-[200px] overflow-y-auto">
            <List
              itemLayout="horizontal"
              dataSource={filterDrafts}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <CiEdit
                      size={20}
                      color="blue"
                      key="edit"
                      onClick={() => handleEdit(index)}
                    />,
                    <RxCross1
                      size={20}
                      color="red"
                      key="delete"
                      onClick={() => handleDelete(index)}
                    />,
                  ]}
                  className="m-2 rounded-sm border"
                  style={{ border: "1px solid darkgray" }}
                  onClick={() => sendTemplate(index)}
                >
                  <List.Item.Meta
                    title={item.subject}
                    className="px-2 font-medium"
                    //   description={item.message}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="space-y-3 rounded-sm border bg-white p-5">
          <Input
            placeholder="Email Subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="mb-4"
          />
          <div className="mb-2 text-sm font-medium text-gray-500">
            The following message will be sent to the recipient when sharing an
            Invoice/Estimate
          </div>
          <textarea
            placeholder="Enter your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="h-32 w-full resize-none rounded-sm border bg-white p-2 text-sm leading-6 outline-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-md bg-[#6571FF] px-10 py-1.5 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Email Draft"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Edit Subject"
          value={editSubject}
          onChange={(e) => setEditSubject(e.target.value)}
          className="mb-4"
        />
        <textarea
          placeholder="Edit Message"
          value={editMessage}
          onChange={(e) => setEditMessage(e.target.value)}
          className="h-32 w-full resize-none rounded-sm border bg-white p-2 text-sm leading-6 outline-none"
        />
      </Modal>
    </div>
  );
}
