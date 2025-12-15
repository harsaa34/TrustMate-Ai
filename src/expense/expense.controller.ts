// src/expense/expense.controller.ts
import { 
  Controller, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Get, 
  Post, 
  Put, 
  Delete,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExpenseService } from './expense.service';
import { Api, User } from '../shared/Decorator/api.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { 
  CreateExpenseDto, 
  UpdateExpenseDto, 
  GetExpensesQueryDto,
  VerifyReceiptDto 
} from './expense.dto';
import {
  ExpenseResponseDto,
  ExpenseListResponseDto,
  
  InsightResponseDto
} from './expense.dto';
import { BalanceResponseDto } from 'src/settlement/settlement.dto';

@ApiTags('Expenses')
@Controller('groups/:groupId/expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @Api({
    isPublic: false,
    verb: 'POST',
    path: '',
    description: 'Create a new expense in a group',
    requestBody: CreateExpenseDto,
    params: [{ name: 'groupId', description: 'Group ID' }],
    swaggerSuccessResponse: ExpenseResponseDto,
    httpCode: HttpStatus.CREATED,
    consumes: ['application/json'],
    produces: ['application/json']
  })
  async createExpense(
    @Param('groupId') groupId: string,
    @Body() createDto: CreateExpenseDto,
    @User('id') createdByUserId: string,
  ): Promise<ExpenseResponseDto> {
    return this.expenseService.createExpense(groupId, createDto, createdByUserId) as any;
  }

  @Get()
  @Api({
    isPublic: false,
    verb: 'GET',
    path: '',
    description: 'Get all expenses for a group with filters',
    params: [{ name: 'groupId', description: 'Group ID' }],
    swaggerSuccessResponse: ExpenseListResponseDto,
    produces: ['application/json']
  })
  async getGroupExpenses(
    @Param('groupId') groupId: string,
    @User('id') userId: string,
    @Query() query: GetExpensesQueryDto,
  ): Promise<ExpenseListResponseDto> {
    const result = await this.expenseService.getGroupExpenses(groupId, userId, query);
    
    // Calculate totalPages here
    const totalPages = Math.ceil(result.total / result.limit);
    
    return {
      expenses: result.expenses as any,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages,
    };
  }

  @Get('summary')
  @Api({
    isPublic: false,
    verb: 'GET',
    path: 'summary',
    description: 'Get expense summary for a group',
    params: [{ name: 'groupId', description: 'Group ID' }],
    swaggerSuccessResponse: {
      totalSpent: Number,
      totalExpenses: Number,
      averageExpense: Number,
      topCategory: String,
      lastExpenseDate: Date
    },
    produces: ['application/json']
  })
  async getExpenseSummary(
    @Param('groupId') groupId: string,
    @User('id') userId: string,
  ): Promise<{
    totalSpent: number;
    totalExpenses: number;
    averageExpense: number;
    topCategory: string;
    lastExpenseDate: Date;
  }> {
    return this.expenseService.getExpenseSummary(groupId, userId);
  }

  @Get('balances')
  @Api({
    isPublic: false,
    verb: 'GET',
    path: 'balances',
    description: 'Calculate balances for all group members',
    params: [{ name: 'groupId', description: 'Group ID' }],
    swaggerSuccessResponse: [BalanceResponseDto],
    produces: ['application/json']
  })
  async getBalances(
    @Param('groupId') groupId: string,
  ): Promise<BalanceResponseDto[]> {
    const balances = await this.expenseService.calculateBalances(groupId);
    
    // Add currency to each balance
    return balances.map(balance => ({
      userId: balance.userId,
      userName: balance.userName,
        amount: balance.amount,
      paidAmount: balance.paidAmount,
      owedAmount: balance.owedAmount,
      currency: 'USD',
    }));
  }

  @Get('insights')
  @Api({
    isPublic: false,
    verb: 'GET',
    path: 'insights',
    description: 'Get spending insights for a group',
    params: [{ name: 'groupId', description: 'Group ID' }],
    swaggerSuccessResponse: InsightResponseDto,
    produces: ['application/json']
  })
  async getSpendingInsights(
    @Param('groupId') groupId: string,
    @Query() query: { period?: 'week' | 'month' | 'year' },
  ): Promise<InsightResponseDto> {
    const period = query.period || 'month';
    const insights = await this.expenseService.getSpendingInsights(groupId, period);
    
    return {
      totalSpent: insights.totalSpent,
      averagePerExpense: insights.averagePerExpense,
      expenseCount: insights.expenseCount,
      categories: insights.categories,
      dailyBreakdown: insights.dailyBreakdown,
    };
  }

  @Get(':expenseId')
  @Api({
    isPublic: false,
    verb: 'GET',
    path: ':expenseId',
    description: 'Get expense by ID',
    params: [
      { name: 'groupId', description: 'Group ID' },
      { name: 'expenseId', description: 'Expense ID' }
    ],
    swaggerSuccessResponse: ExpenseResponseDto,
    produces: ['application/json']
  })
  async getExpenseById(
    @Param('groupId') groupId: string,
    @Param('expenseId') expenseId: string,
    @User('id') userId: string,
  ): Promise<ExpenseResponseDto> {
    return this.expenseService.getExpenseById(expenseId, userId) as any;
  }

  @Put(':expenseId')
  @Api({
    isPublic: false,
    verb: 'PUT',
    path: ':expenseId',
    description: 'Update an expense',
    params: [
      { name: 'groupId', description: 'Group ID' },
      { name: 'expenseId', description: 'Expense ID' }
    ],
    requestBody: UpdateExpenseDto,
    swaggerSuccessResponse: ExpenseResponseDto,
    consumes: ['application/json'],
    produces: ['application/json']
  })
  async updateExpense(
    @Param('groupId') groupId: string,
    @Param('expenseId') expenseId: string,
    @Body() updateDto: UpdateExpenseDto,
    @User('id') userId: string,
  ): Promise<ExpenseResponseDto> {
    return this.expenseService.updateExpense(expenseId, updateDto, userId) as any;
  }

  @Delete(':expenseId')
  @Api({
    isPublic: false,
    verb: 'DELETE',
    path: ':expenseId',
    description: 'Delete an expense',
    params: [
      { name: 'groupId', description: 'Group ID' },
      { name: 'expenseId', description: 'Expense ID' }
    ],
    swaggerSuccessResponse: { success: Boolean, message: String },
    produces: ['application/json']
  })
  async deleteExpense(
    @Param('groupId') groupId: string,
    @Param('expenseId') expenseId: string,
    @User('id') userId: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.expenseService.deleteExpense(expenseId, userId);
    return { success: true, message: 'Expense deleted successfully' };
  }

  @Post(':expenseId/verify')
  @Api({
    isPublic: false,
    verb: 'POST',
    path: ':expenseId/verify',
    description: 'Verify receipt for an expense',
    params: [
      { name: 'groupId', description: 'Group ID' },
      { name: 'expenseId', description: 'Expense ID' }
    ],
    requestBody: VerifyReceiptDto,
    swaggerSuccessResponse: { verified: Boolean, confidence: Number },
    consumes: ['application/json'],
    produces: ['application/json']
  })
  async verifyReceipt(
    @Param('groupId') groupId: string,
    @Param('expenseId') expenseId: string,
    @Body() verifyDto: VerifyReceiptDto,
    @User('id') userId: string,
  ): Promise<{ verified: boolean; confidence: number }> {
    return this.expenseService.verifyReceipt(expenseId, verifyDto, userId);
  }

  @Post('upload-receipt')
  @Api({
    isPublic: false,
    verb: 'POST',
    path: 'upload-receipt',
    description: 'Upload receipt image',
    swaggerSuccessResponse: { url: String, filename: String },
    consumes: ['multipart/form-data'],
    produces: ['application/json']
  })
  async uploadReceipt(
    @Body() body: { file: any },
  ): Promise<{ url: string; filename: string }> {
    return {
      url: `https://storage.example.com/receipts/${body.file?.originalname || 'receipt.jpg'}`,
      filename: body.file?.originalname || 'receipt.jpg',
    };
  }
}